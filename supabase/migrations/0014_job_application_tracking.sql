-- Tracks what happens after an application goes out. Applied jobs used to
-- drop out of /admin/jobs entirely; they now sit in a collapsible "Applied"
-- section grouped by month, and each one carries four independent
-- milestones Omole can tick in any order, since not every company follows
-- the same process (some skip straight to an offer, some never reply).
--
-- applied_at is its own column, not updated_at, because updated_at changes
-- every time a milestone is ticked and would move the job into the wrong
-- month. Each milestone is a timestamp rather than a boolean so the date it
-- happened is kept for free; null means "not yet".

alter table public.job_matches
  add column applied_at   timestamptz,
  add column feedback_at  timestamptz,
  add column interview_at timestamptz,
  add column offer_at     timestamptz,
  add column rejected_at  timestamptz;

-- Backfill jobs already marked applied. email_sent_at is exact for emailed
-- applications; updated_at is the closest record for the rest.
update public.job_matches
  set applied_at = coalesce(email_sent_at, updated_at)
  where status = 'applied' and applied_at is null;

create index job_matches_applied_at_idx on public.job_matches (applied_at);

-- After applying, verify:
--   select count(*) from public.job_matches
--     where status = 'applied' and applied_at is null;
--   -- expect 0.
