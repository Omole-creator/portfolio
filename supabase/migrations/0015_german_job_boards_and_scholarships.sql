-- Two things, both asked for on 2026-11-11.
--
-- 1. Three German job boards as job sources: English Jobs Germany,
--    IamExpat Jobs Germany, and the Bundesagentur fuer Arbeit's Jobboerse
--    (whose database also feeds Make it in Germany's and JobMESH's
--    listings). See lib/jobs/fetchers/englishjobsde.ts, iamexpat.ts and
--    arbeitsagentur.ts. Arbeitnow was already a source. Matches from all
--    four get a green "German job board" mark in /admin/jobs.
--
-- 2. scholarship_programs, behind /admin/scholarship: English-taught
--    health informatics master's programs Omole is tracking, with their
--    application windows. A daily cron (/api/scholarships/check) works out
--    which are open, re-reads each program's page for "applications are
--    open" wording, and emails him when something opens.

-- 1. German job boards --------------------------------------------------

alter table public.job_sources drop constraint job_sources_ats_check;
alter table public.job_sources add constraint job_sources_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup','hackernews','remoterocketship','getro','consider',
     'englishjobsde','iamexpat','arbeitsagentur'));

alter table public.job_matches drop constraint job_matches_ats_check;
alter table public.job_matches add constraint job_matches_ats_check
  check (ats in
    ('greenhouse','lever','ashby','workable','smartrecruiters','recruitee','breezy','custom',
     'remoteok','remotive','jobicy','arbeitnow','himalayas','workingnomads',
     'wellfound','workatastartup','hackernews','remoterocketship','getro','consider',
     'englishjobsde','iamexpat','arbeitsagentur'));

insert into public.job_sources (company_name, ats, board_token, hires_globally, track)
values
  ('English Jobs Germany', 'englishjobsde', 'default', false, 'both'),
  ('IamExpat Jobs Germany', 'iamexpat', 'default', false, 'both'),
  ('Bundesagentur fuer Arbeit (also Make it in Germany, JobMESH)', 'arbeitsagentur', 'default', false, 'both');

-- 2. Scholarship tracker ------------------------------------------------

create table public.scholarship_programs (
  id                uuid primary key default gen_random_uuid(),
  university        text not null,
  program           text not null,
  country           text not null,
  city              text,
  -- 'direct' = a health informatics program; 'closest' = the nearest thing
  -- a university Omole named actually offers (fit_note says why).
  fit               text not null default 'direct' check (fit in ('direct','closest')),
  fit_note          text,
  tuition_note      text,
  funding_note      text,
  english_note      text,
  ielts_required    text not null default 'unclear' check (ielts_required in ('no','yes','unclear')),
  -- Recurring yearly windows: [{"label": "...", "opens": "MM-DD" | null,
  -- "closes": "MM-DD" | null, "confirmed": bool}]. opens may be null when a
  -- university only publishes its deadline.
  windows           jsonb not null default '[]'::jsonb,
  windows_note      text,
  apply_url         text,
  info_url          text not null,
  -- The page the daily check re-reads; falls back to info_url.
  watch_url         text,
  page_hash         text,
  page_signal       text,
  page_changed_at   timestamptz,
  last_checked_at   timestamptz,
  -- Every alert already emailed, so each one goes out once.
  notified_keys     text[] not null default '{}',
  active            boolean not null default true,
  sort_order        integer not null default 100,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.scholarship_programs enable row level security;

-- The cron has no user session and uses the anon key (same as the job
-- sync). It can read active programs and update only the check columns.
-- Nothing in here is private: it's public program information.
create policy "anon can select active scholarship programs"
  on public.scholarship_programs for select to anon using (active = true);

create policy "anon can update scholarship check columns"
  on public.scholarship_programs for update to anon
  using (active = true) with check (active = true);

revoke insert, delete, update on public.scholarship_programs from anon;
grant update (page_hash, page_signal, page_changed_at, last_checked_at, notified_keys)
  on public.scholarship_programs to anon;

create policy "authenticated can select scholarship programs"
  on public.scholarship_programs for select to authenticated using (true);
create policy "authenticated can insert scholarship programs"
  on public.scholarship_programs for insert to authenticated with check (true);
create policy "authenticated can update scholarship programs"
  on public.scholarship_programs for update to authenticated using (true) with check (true);
create policy "authenticated can delete scholarship programs"
  on public.scholarship_programs for delete to authenticated using (true);

-- Starting list, researched 2026-11-11. Dates marked confirmed were read
-- off the program's own page that day; unconfirmed ones come from an
-- earlier cycle or a third-party listing and are flagged in the UI.
insert into public.scholarship_programs
  (sort_order, university, program, country, city, fit, fit_note, tuition_note, funding_note,
   english_note, ielts_required, windows, windows_note, apply_url, info_url, watch_url)
values
  (10, 'Neu-Ulm University of Applied Sciences (HNU)', 'MSc Artificial Intelligence and Health Informatics',
   'Germany', 'Neu-Ulm', 'direct', null,
   'No tuition fees, only a semester fee.', null,
   'A degree taught entirely in English counts as proof, so no IELTS is needed.', 'no',
   '[{"label":"Summer semester start (non-EU)","opens":"11-15","closes":"01-15","confirmed":true},
     {"label":"Winter semester start (non-EU)","opens":"05-02","closes":"07-15","confirmed":true}]',
   'The summer-semester window on HNU''s page has an extra condition attached. Read it on the page before applying for a summer start.',
   'https://campus.hnu.de/qisserver/pages/cs/sys/portal/hisinoneStartPage.faces',
   'https://www.hnu.de/en/studies/degree-programmes/masters-programmes/artificial-intelligence-and-health-informatics-msc',
   null),

  (20, 'Hasso Plattner Institute / University of Potsdam', 'MSc Digital Health',
   'Germany', 'Potsdam', 'direct', null,
   'No tuition fees, only the University of Potsdam semester fee.', null,
   'English at C1 level. The page doesn''t say whether an English-taught degree is accepted as proof instead of a test.', 'unclear',
   '[{"label":"Winter semester","opens":"04-01","closes":"06-01","confirmed":true}]',
   null,
   'https://hpi.de/en/studies/application/application-digital-health-msc/',
   'https://hpi.de/en/studies/digital-health-msc/', null),

  (30, 'Deggendorf Institute of Technology (European Campus)', 'MSc Digital Health',
   'Germany', 'Pfarrkirchen', 'direct', null,
   'No tuition fees. Non-EU students pay a service fee each semester.', null,
   'Taught in English. Check the page for which English proof is accepted.', 'unclear',
   '[{"label":"Winter semester","opens":"04-15","closes":"07-15","confirmed":true}]',
   null,
   'https://www.th-deg.de/en/apply#international',
   'https://www.th-deg.de/dh-m-en', null),

  (40, 'University of Tübingen', 'MSc Medical Informatics',
   'Germany', 'Tübingen', 'direct', null,
   'Baden-Württemberg charges non-EU students about €1,500 per semester. Confirm on the page.', null,
   'Can be studied entirely in English. Check the page for which English proof is accepted.', 'unclear',
   '[{"label":"Winter semester (non-EU)","opens":null,"closes":"07-15","confirmed":true},
     {"label":"Summer semester (non-EU)","opens":null,"closes":"01-15","confirmed":true}]',
   'Tübingen publishes only the non-EU deadlines, not when the portal opens.',
   'https://uni-tuebingen.de/en/study/application-and-enrollment/masters-degree/',
   'https://uni-tuebingen.de/en/study/finding-a-course/degree-programs-available/detail/course/medizininformatikmedical-informatics-master/',
   null),

  (50, 'University of Regensburg', 'MSc Data Science (Computational Life Sciences track)',
   'Germany', 'Regensburg', 'closest',
   'Regensburg has no health informatics master''s. This English-taught data science degree with a life-sciences track is the nearest fit.',
   'No tuition fees in Bavaria, only a semester fee.', null,
   'B2 English. A bachelor''s thesis written in English counts as proof, so no IELTS is needed if yours was.', 'no',
   '[{"label":"Winter semester","opens":null,"closes":"06-01","confirmed":false}]',
   'The 1 June deadline comes from the university''s 2025 announcement. Confirm it for 2027.',
   'https://www.uni-regensburg.de/en/informatics-data-science/study/prospective-students/msc-data-science/application-admission',
   'https://www.uni-regensburg.de/en/studies/prospective-students/study-programs/master/data-science-msc',
   'https://www.uni-regensburg.de/en/informatics-data-science/study/prospective-students/msc-data-science/application-admission'),

  (60, 'University of Bonn (Bonn-Aachen International Center for IT)', 'MSc Life Science Informatics',
   'Germany', 'Bonn', 'closest',
   'Bonn has no health informatics master''s. Life Science Informatics (biomedical data and information systems, taught in English) is the nearest fit.',
   'No tuition fees in North Rhine-Westphalia, only a semester fee.', null,
   'Taught in English. Check the page for which English proof is accepted.', 'unclear',
   '[{"label":"Winter semester","opens":null,"closes":"03-01","confirmed":false}]',
   'The 1 March deadline is from an older DAAD listing. Confirm it on the page.',
   null,
   'https://www.b-it-center.de/study-programs/life-science-informatics/', null),

  (70, 'University of Debrecen', 'MSc Public Health (health informatics is a core subject)',
   'Hungary', 'Debrecen', 'closest',
   'No English-taught health informatics master''s turned up in Hungary. This public health MSc teaches health informatics as one of its main subjects.',
   '8,000 USD a year if self-funded.',
   'Stipendium Hungaricum (Nigeria is a partner country) covers tuition, a monthly stipend and housing.',
   'A medium-of-instruction certificate from an English-taught degree is accepted, so no IELTS is needed. There is an entrance interview.', 'no',
   '[{"label":"Stipendium Hungaricum call","opens":"11-01","closes":"01-15","confirmed":false}]',
   'Last cycle''s call opened in early November 2025 and closed in mid-January 2026. The daily check watches the Stipendium Hungaricum site for the new call.',
   'https://apply.stipendiumhungaricum.hu/',
   'https://edu.unideb.hu/p/public-health-msc',
   'https://apply.stipendiumhungaricum.hu/'),

  (80, 'UAS Technikum Wien', 'MSc Medical Engineering & eHealth',
   'Austria', 'Vienna', 'direct', null,
   '€3,000 per semester for non-EU students.', null,
   'Taught in English. Check the page for which English proof is accepted.', 'unclear',
   '[{"label":"Winter semester (non-EU)","opens":"10-01","closes":"03-31","confirmed":false}]',
   'The 31 March 2027 non-EU deadline is on the page. The 1 October opening date comes from an earlier cycle.',
   'https://www.technikum-wien.at/en/programs/master-medical-engineering-ehealth/',
   'https://www.technikum-wien.at/en/programs/master-medical-engineering-ehealth/', null),

  (90, 'University of Limerick', 'MSc Health Informatics',
   'Ireland', 'Limerick', 'direct', null,
   'High: €21,600 a year for non-EU students.',
   'Government of Ireland International Education Scholarship is the main route for Nigerians. Check its own call.',
   'Check the page for whether an English-taught degree is accepted instead of IELTS.', 'unclear',
   '[{"label":"Non-EU applicants who need a visa","opens":null,"closes":"05-01","confirmed":false}]',
   '1 May was the 2026 closing date for non-EU applicants needing a visa.',
   'https://www.ul.ie/study/postgraduate/health-informatics-msc/apply',
   'https://www.ul.ie/study/postgraduate/health-informatics-msc', null),

  (100, 'University of Galway', 'MSc Health Data Science',
   'Ireland', 'Galway', 'direct', null,
   'High tuition for non-EU students.', 'The university advertises scholarships for non-EU students.',
   'Asks for IELTS 6.5 from applicants whose first language isn''t English. Ask admissions whether a Nigerian English-taught degree is enough.', 'unclear',
   '[]',
   'Rolling admission with no fixed closing date.',
   null,
   'https://www.universityofgalway.ie/courses/taught-postgraduate-courses/health-data-science.html', null),

  (110, 'University of Toronto', 'Master of Health Informatics',
   'Canada', 'Toronto', 'direct', null,
   'High international tuition.', 'No funding confirmed for international students.',
   'Check the page for English requirements.', 'unclear',
   '[{"label":"Fall entry","opens":null,"closes":"01-06","confirmed":false}]',
   'The deadline for Fall 2026 entry was 6 January 2026.',
   null,
   'https://www.sgs.utoronto.ca/programs/health-informatics/', null);

-- After applying, verify:
--   select count(*) from public.scholarship_programs;  -- expect 11
--   select company_name from public.job_sources where ats in ('englishjobsde','iamexpat','arbeitsagentur');
