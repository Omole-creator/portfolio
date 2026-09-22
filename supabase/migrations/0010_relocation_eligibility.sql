-- Adds a third eligibility value, 'relocation', alongside 'worldwide' and
-- 'unconfirmed'. The first two only ever applied to remote postings (see
-- lib/jobs/classify.ts's checkEligibility); this one is for the opposite
-- case - an onsite role in Germany, the Netherlands, or Austria whose own
-- text explicitly offers visa sponsorship or relocation support. Those
-- postings used to be rejected outright at the very first line of
-- classifyJob (isRemoteJob check), since the whole pipeline was built
-- around "remote work reachable from Nigeria." Omole asked to also surface
-- roles he'd have to physically relocate for, as long as the company is
-- actually willing to sponsor that move.

alter table public.job_matches drop constraint job_matches_eligibility_check;
alter table public.job_matches add constraint job_matches_eligibility_check
  check (eligibility in ('worldwide','unconfirmed','relocation'));

-- After applying, verify:
--   select conname, pg_get_constraintdef(oid) from pg_constraint
--     where conname = 'job_matches_eligibility_check';
--   -- expect 'relocation' present in the check definition.
