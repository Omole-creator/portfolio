-- Adds the company's own posting date to job_matches, distinct from
-- first_seen_at (when our own daily sync first found the row). Populated
-- from each ATS's own data where it exposes one (see NormalizedJob.posted_at
-- in lib/jobs/types.ts for which platforms were confirmed live); null when
-- a source has no such field. classify.ts uses this to reject anything
-- older than a week at classification time, so this column mostly documents
-- what already passed that gate - useful for /admin/jobs to show "posted N
-- days ago" without a second lookup.

alter table public.job_matches add column posted_at timestamptz;

-- After applying, verify:
--   select column_name from information_schema.columns
--     where table_schema = 'public' and table_name = 'job_matches'
--     and column_name = 'posted_at';
