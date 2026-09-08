-- job_sources.region_hint had four options (us / australia / us_or_australia /
-- remote_global), but lib/jobs/classify.ts's checkEligibility() only ever
-- treated 'remote_global' differently - the other three were functionally
-- identical to each other (all just meant "exclude the ambiguous bare-remote
-- case"). That's confusing in the admin UI, since it implies "US" and
-- "Australia" mean something different from each other when they don't, and
-- neither one means "jobs Nigerians/Africans can apply for" - the actual
-- eligibility check is driven entirely by the job's own text (see
-- classify.ts's EXCLUSION_PATTERNS / WORLDWIDE_PATTERNS). Replacing the
-- four-option field with a plain boolean: does the admin know this company
-- hires remote workers from anywhere (including Africa), or not.

alter table public.job_sources add column hires_globally boolean not null default false;

update public.job_sources set hires_globally = (region_hint = 'remote_global');

alter table public.job_sources drop column region_hint;

-- After applying, verify:
--   select column_name from information_schema.columns
--     where table_schema = 'public' and table_name = 'job_sources';
--   -- expect hires_globally present, region_hint gone.
