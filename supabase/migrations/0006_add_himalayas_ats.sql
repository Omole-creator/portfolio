-- Himalayas is a fifth remote-job aggregator, added because its keyword
-- search (the `q` param) was confirmed live to actually narrow results -
-- unlike Remotive's `category` and Jobicy's `tag` params, which were
-- tested and found to return the same unfiltered set regardless of value.
-- board_token holds the search query for this source (e.g. "growth
-- marketing"), same convention as the other aggregators.

alter table public.job_sources drop constraint job_sources_ats_check;
alter table public.job_sources add constraint job_sources_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas'));

alter table public.job_matches drop constraint job_matches_ats_check;
alter table public.job_matches add constraint job_matches_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas'));

-- After applying, verify:
--   select conname from pg_constraint
--     where conname in ('job_sources_ats_check', 'job_matches_ats_check');
--   -- both should exist with himalayas included.
