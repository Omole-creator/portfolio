-- Adds "web" as a third job track alongside growth and marketing: the
-- AI-assisted rapid web/product builder persona from /web (design + copy +
-- development, moving fast with Claude Code, not a traditional
-- CS-background software engineer). See lib/web-content.ts,
-- lib/jobs/classify.ts's WEB_KEYWORDS, and
-- public/omole-usuangbon-web-developer-cv.pdf.

alter table public.job_sources drop constraint job_sources_track_check;
alter table public.job_sources add constraint job_sources_track_check
  check (track in ('growth','marketing','web','both'));

alter table public.job_matches drop constraint job_matches_track_check;
alter table public.job_matches add constraint job_matches_track_check
  check (track in ('growth','marketing','web'));

-- After applying, verify:
--   select conname, pg_get_constraintdef(oid) from pg_constraint
--     where conname in ('job_sources_track_check','job_matches_track_check');
--   -- expect 'web' present in both check definitions.
