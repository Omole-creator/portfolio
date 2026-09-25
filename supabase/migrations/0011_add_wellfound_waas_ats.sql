-- Wellfound and Y Combinator's Work at a Startup as job sources. Both need
-- an account to apply (a Wellfound account, a YC account), which breaks the
-- usual "no account sign-up" rule for job sources. Omole named these two as
-- the only exceptions. See lib/jobs/fetchers/wellfound.ts and
-- lib/jobs/fetchers/workatastartup.ts for how each is read without a browser.
--
-- board_token for both is a comma-separated list (Wellfound role slugs, or
-- Work at a Startup search terms), or "default" for the built-in set.

alter table public.job_sources drop constraint job_sources_ats_check;
alter table public.job_sources add constraint job_sources_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup'));

alter table public.job_matches drop constraint job_matches_ats_check;
alter table public.job_matches add constraint job_matches_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup'));

-- Then add the two sources (or add them from /admin/jobs, "Fix it manually"
-- panel, with "default" as the token):
insert into public.job_sources (company_name, ats, board_token, hires_globally, track)
values
  ('Wellfound', 'wellfound', 'default', false, 'both'),
  ('Work at a Startup (YC)', 'workatastartup', 'default', false, 'both');
