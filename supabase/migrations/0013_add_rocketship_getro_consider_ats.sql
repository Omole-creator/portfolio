-- Remote Rocketship plus VC portfolio job boards (the Wellfound-style
-- "roles at startups this firm funded" pages) on the two platforms most of
-- them run on, Getro and Consider. See lib/jobs/fetchers/remoterocketship.ts,
-- getro.ts, and consider.ts. All three link to the employer's own apply
-- page, so no account sign-up is involved. Each board below was checked
-- live on 2026-09-26 and returned relevant remote roles; a16z's Consider
-- board (no session token on its page) and Point Nine's Getro board (no
-- relevant remote roles) were left out.

alter table public.job_sources drop constraint job_sources_ats_check;
alter table public.job_sources add constraint job_sources_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup','hackernews','remoterocketship','getro','consider'));

alter table public.job_matches drop constraint job_matches_ats_check;
alter table public.job_matches add constraint job_matches_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup','hackernews','remoterocketship','getro','consider'));

insert into public.job_sources (company_name, ats, board_token, hires_globally, track)
values
  ('Remote Rocketship', 'remoterocketship', 'default', false, 'both'),
  ('General Catalyst portfolio', 'getro', 'jobs.generalcatalyst.com', false, 'both'),
  ('Accel portfolio', 'getro', 'jobs.accel.com', false, 'both'),
  ('NFX portfolio', 'getro', 'jobs.nfx.com', false, 'both'),
  ('Khosla Ventures portfolio', 'getro', 'jobs.khoslaventures.com', false, 'both'),
  ('Insight Partners portfolio', 'getro', 'jobs.insightpartners.com', false, 'both'),
  ('8VC portfolio', 'getro', 'jobs.8vc.com', false, 'both'),
  ('Sequoia portfolio', 'consider', 'jobs.sequoiacap.com', false, 'both'),
  ('Lightspeed portfolio', 'consider', 'jobs.lsvp.com', false, 'both'),
  ('Bessemer portfolio', 'consider', 'jobs.bvp.com', false, 'both'),
  ('Kleiner Perkins portfolio', 'consider', 'jobs.kleinerperkins.com', false, 'both'),
  ('GV portfolio', 'consider', 'jobs.gv.com', false, 'both'),
  ('Battery Ventures portfolio', 'consider', 'jobs.battery.com', false, 'both'),
  ('Forerunner portfolio', 'consider', 'jobs.forerunnerventures.com', false, 'both');
