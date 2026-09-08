-- Job application machine: daily-matched roles pulled directly from
-- companies' own hiring systems (Greenhouse, Lever, Ashby, Workable,
-- SmartRecruiters, Recruitee, Breezy, or a best-effort scrape of a bespoke
-- careers page - see lib/jobs/fetchers/), listed in /admin for a one-tap
-- "prepare application" action. Nothing here submits an application
-- anywhere; it only drafts a cover letter, picks the right CV and
-- portfolio link, and (best-effort) drafts answers to that job's own
-- custom application questions, for a human to review and paste in by hand.

-- Admin-curated list of companies whose ATS boards get polled daily. Starts
-- empty on purpose: don't seed guessed board tokens, add real ones through
-- /admin/jobs once verified with a live fetch.
--
-- region_hint only matters as a tiebreaker for an ambiguous bare "Remote"
-- posting with no other eligibility signal (see lib/jobs/classify.ts):
-- 'remote_global' lets those through for this source, anything else keeps
-- them excluded by default. A company's "Remote" listings are usually
-- scoped to specific countries it already has payroll/legal set up for,
-- not open to a candidate applying from Nigeria/Africa.
create table public.job_sources (
  id            uuid primary key default gen_random_uuid(),
  company_name  text not null,
  ats           text not null check (ats in
                  ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom')),
  board_token   text not null,
  region_hint   text not null check (region_hint in ('us','australia','us_or_australia','remote_global')),
  track         text not null check (track in ('growth','marketing','both')),
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  constraint job_sources_unique_board unique (ats, board_token)
);

alter table public.job_sources enable row level security;

-- The daily sync route has no user session (it authenticates via a
-- CRON_SECRET bearer token, not a Supabase login), so it reads this table as
-- anon. Board tokens aren't secret, they're public API path segments, so a
-- narrow read of active rows is fine to expose to anon.
create policy "anon can select active job sources"
  on public.job_sources
  for select
  to anon
  using (active = true);

create policy "authenticated can select job sources"
  on public.job_sources for select to authenticated using (true);

create policy "authenticated can insert job sources"
  on public.job_sources for insert to authenticated with check (true);

create policy "authenticated can update job sources"
  on public.job_sources for update to authenticated using (true) with check (true);

create policy "authenticated can delete job sources"
  on public.job_sources for delete to authenticated using (true);

-- One row per job posting the daily sync has ever seen, deduped by the
-- ATS's own id so a re-sync never creates duplicates or clobbers a row the
-- admin has already prepared or applied to.
--
-- eligibility records why the posting was let through the "can someone
-- applying from Nigeria/Africa actually get hired for this" filter in
-- lib/jobs/classify.ts: 'worldwide' means an explicit signal was found
-- (says "remote anywhere," names Africa/Nigeria, runs through an
-- employer-of-record platform, etc.); 'unconfirmed' means it was a bare
-- "Remote" listing with no explicit scope, let through only because its
-- source is tagged region_hint = 'remote_global'. Every job that names a
-- specific other country, requires citizenship/work authorization there,
-- or is not remote at all is rejected before it ever reaches this table -
-- there is no 'excluded' status stored, it's just never inserted.
create table public.job_matches (
  id                uuid primary key default gen_random_uuid(),
  source_id         uuid references public.job_sources(id) on delete set null,
  ats               text not null check (ats in
                      ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom')),
  external_id       text not null,
  company_name      text not null,
  title             text not null,
  location_text     text,
  eligibility       text not null check (eligibility in ('worldwide','unconfirmed')),
  apply_url         text not null,
  description_text  text,
  track             text not null check (track in ('growth','marketing')),
  keyword_hits      text[] not null default '{}',
  status            text not null default 'new'
                       check (status in ('new','prepared','applied','dismissed')),
  cover_letter      text,
  qa_pairs          jsonb,
  extraction_ok     boolean,
  cv_path           text,
  portfolio_url     text,
  -- A direct application email found on the apply page or in the job
  -- description (see lib/jobs/extractQuestions.ts) - null when the company
  -- only takes applications through a form. email_sent_at is set once the
  -- drafted email actually goes out via Gmail (app/admin/jobs/actions.ts),
  -- both only populated once "Prepare application" has run.
  apply_email       text,
  email_sent_at     timestamptz,
  prepared_at       timestamptz,
  first_seen_at     timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint job_matches_unique_posting unique (ats, external_id)
);

create index job_matches_status_idx on public.job_matches (status);
create index job_matches_track_idx on public.job_matches (track);
create index job_matches_first_seen_at_brin on public.job_matches using brin (first_seen_at);

alter table public.job_matches enable row level security;

create policy "anon can insert job matches"
  on public.job_matches
  for insert
  to anon
  with check (true);

-- Needed so the cron's upsert-on-conflict path can touch an already-seen
-- row without erroring; ignoreDuplicates in the app code (not this policy)
-- is what actually stops a re-sync from overwriting a prepared/applied
-- row's status or generated content.
create policy "anon can update job matches"
  on public.job_matches
  for update
  to anon
  using (true)
  with check (true);

create policy "authenticated can select job matches"
  on public.job_matches for select to authenticated using (true);

create policy "authenticated can update job matches"
  on public.job_matches for update to authenticated using (true) with check (true);

create policy "authenticated can delete job matches"
  on public.job_matches for delete to authenticated using (true);

-- After applying, verify:
--   select * from pg_policies where schemaname = 'public'
--     and tablename in ('job_sources','job_matches');
--   -- expect 5 policies on job_sources, 5 on job_matches.
-- job_sources should start with zero rows. Add a source only after
-- confirming its board token with a live request, e.g.:
--   https://boards-api.greenhouse.io/v1/boards/<token>/jobs?content=true
--   https://api.lever.co/v0/postings/<token>?mode=json
--   https://api.ashbyhq.com/posting-api/job-board/<token>
--   https://apply.workable.com/api/v1/widget/accounts/<token>?details=true
--   https://api.smartrecruiters.com/v1/companies/<token>/postings
--   https://<token>.recruitee.com/api/offers/
--   https://<token>.breezy.hr/json
-- For ats = 'custom', board_token is the full careers page URL instead of
-- a short token - no live-request check applies, just confirm the URL
-- loads a real list of job postings.
