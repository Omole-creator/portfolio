-- Working Nomads is a sixth remote-job aggregator, structurally different
-- from the other five: its listing URL is a genuine redirect to the real
-- employer's own application page (confirmed live - resolves to
-- apply.workable.com, career.proxify.io, etc.), not a page the aggregator
-- itself hosts. See lib/jobs/fetchers/workingnomads.ts for how it resolves
-- that redirect and filters out any destination that turns out to require
-- an account (confirmed live: one posting resolved straight to an
-- "/auth/signup" endpoint on the employer's own site). board_token is
-- unused for this source (its `category` query param was tested live and
-- found to not narrow results, same as Remotive's and Jobicy's), same
-- convention as RemoteOK and Arbeitnow.

alter table public.job_sources drop constraint job_sources_ats_check;
alter table public.job_sources add constraint job_sources_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads'));

alter table public.job_matches drop constraint job_matches_ats_check;
alter table public.job_matches add constraint job_matches_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads'));

-- After applying, verify:
--   select conname from pg_constraint
--     where conname in ('job_sources_ats_check', 'job_matches_ats_check');
--   -- both should exist with workingnomads included.
