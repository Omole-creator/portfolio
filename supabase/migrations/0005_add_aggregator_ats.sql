-- Individually adding companies one at a time doesn't scale to meaningful
-- coverage (there's no free way to search "every company on Greenhouse" -
-- these platforms don't publish a directory). Adding four free, public,
-- no-auth remote-job aggregator APIs as recognized ats values instead:
-- RemoteOK, Remotive, Jobicy, and Arbeitnow each already cover thousands of
-- companies. Every job that comes through them still passes the exact same
-- track/remote/eligibility filters as everything else in
-- lib/jobs/classify.ts - nothing here changes what counts as a match.
--
-- For these four, board_token holds a category/tag filter (e.g.
-- "marketing") rather than a per-company identifier, since there's no
-- single company to scope to.
--
-- The constraint names below (job_sources_ats_check, job_matches_ats_check)
-- are Postgres's default auto-generated name for an inline `check (...)` on
-- a column named `ats` (pattern: {table}_{column}_check). If either DROP
-- fails with "constraint does not exist," run this first to find the real
-- name and substitute it:
--   select conname from pg_constraint
--     where conrelid = 'public.job_sources'::regclass and contype = 'c';

alter table public.job_sources drop constraint job_sources_ats_check;
alter table public.job_sources add constraint job_sources_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow'));

alter table public.job_matches drop constraint job_matches_ats_check;
alter table public.job_matches add constraint job_matches_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow'));

-- After applying, verify:
--   select conname from pg_constraint
--     where conname in ('job_sources_ats_check', 'job_matches_ats_check');
--   -- both should exist with the expanded list.
