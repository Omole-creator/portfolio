-- Hacker News' monthly "Ask HN: Who is hiring?" thread as a job source,
-- where founders post their own roles and often say outright whether remote
-- means worldwide. See lib/jobs/fetchers/hackernews.ts. Applying is by email
-- or the company's own site, so no account sign-up is involved.

alter table public.job_sources drop constraint job_sources_ats_check;
alter table public.job_sources add constraint job_sources_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup','hackernews'));

alter table public.job_matches drop constraint job_matches_ats_check;
alter table public.job_matches add constraint job_matches_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup','hackernews'));

insert into public.job_sources (company_name, ats, board_token, hires_globally, track)
values ('Hacker News: Who is hiring?', 'hackernews', 'default', false, 'both');
