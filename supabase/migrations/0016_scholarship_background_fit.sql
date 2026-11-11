-- Follow-up sweep of the scholarship tracker, 2026-11-11, using the two
-- official course databases: DAAD's International Programmes (444 English
-- master's across health-informatics-type search terms) and the full
-- Stipendium Hungaricum course list (~1,000 courses, none of them health
-- informatics). Omole's degree is a Doctor of Pharmacy, which several
-- programs don't accept, so each program now records whether his degree
-- qualifies.

alter table public.scholarship_programs
  add column background_fit text not null default 'maybe'
    check (background_fit in ('yes','maybe','no')),
  add column background_note text;

-- Corrections and background fit for the existing programs ----------------

update public.scholarship_programs set background_fit = 'no',
  background_note = 'Needs a computer science-type bachelor''s (computer science, software, data science, digital health) of 210 ECTS. A pharmacy degree doesn''t qualify.'
  where university like 'Neu-Ulm%';

update public.scholarship_programs set background_fit = 'no',
  background_note = 'Needs a computer science or related bachelor''s plus proof of programming skills (R, Python, etc.). A pharmacy degree doesn''t qualify.'
  where university like 'Hasso Plattner%';

update public.scholarship_programs set background_fit = 'yes',
  background_note = 'Takes bachelor''s degrees in medicine, health and natural sciences, so your PharmD fits.',
  tuition_note = '€500 per semester for non-EU students, plus the student union fee.',
  english_note = 'DAAD lists a C1 certificate (e.g. IELTS 7) but says exemptions are on the course website. Check whether your English-taught degree counts.'
  where university like 'Deggendorf%' and program = 'MSc Digital Health';

update public.scholarship_programs set background_fit = 'maybe', ielts_required = 'yes',
  background_note = 'Takes medical informatics, computer science, life sciences or equivalent. Pharmacy may count as life sciences; ask admissions.',
  english_note = 'DAAD lists a B2 certificate (IELTS 6.5 or equivalent) and no exemption.'
  where university = 'University of Tübingen';

update public.scholarship_programs set background_fit = 'no',
  background_note = 'Needs 30 ECTS of data science and 18 ECTS of maths from your bachelor''s, which a pharmacy degree is unlikely to have.',
  windows = '[{"label":"Summer semester start","opens":"10-15","closes":"12-01","confirmed":true},
              {"label":"Winter semester start","opens":null,"closes":"06-01","confirmed":true}]',
  windows_note = 'Both dates are from the DAAD 2026/27 listing.'
  where university = 'University of Regensburg';

update public.scholarship_programs set background_fit = 'maybe',
  background_note = 'Accepts pharmaceutics, but expects about a year''s worth each of programming, algorithms, maths and biochemistry. The GRE is strongly recommended.',
  windows = '[{"label":"Winter semester","opens":"12-01","closes":"03-01","confirmed":true}]',
  windows_note = 'From the DAAD 2026/27 listing.'
  where university like 'University of Bonn%';

update public.scholarship_programs set background_fit = 'yes',
  background_note = 'A health degree fits this public health program.'
  where university = 'University of Debrecen';

update public.scholarship_programs set background_fit = 'maybe',
  background_note = 'An engineering-leaning program. Check whether a pharmacy degree is accepted.'
  where university = 'UAS Technikum Wien';

update public.scholarship_programs set background_fit = 'maybe',
  background_note = 'Check the entry requirements for health graduates.'
  where university in ('University of Limerick','University of Galway','University of Toronto');

-- New programs from the sweep -------------------------------------------

insert into public.scholarship_programs
  (sort_order, university, program, country, city, fit, fit_note, tuition_note, funding_note,
   english_note, ielts_required, background_fit, background_note, windows, windows_note,
   apply_url, info_url, watch_url)
values
  (5, 'EMMaH consortium (coordinated with Hamburg University of Applied Sciences)',
   'Erasmus Mundus Master in Medical Technology and Healthcare Business',
   'Erasmus Mundus', 'Hamburg and partner universities', 'direct',
   'Covers medical technology, digital health and healthcare business.',
   'Covered for scholarship holders. €7,770 a year if self-funded.',
   'Erasmus Mundus scholarship. About 20 students are selected per cohort.',
   'B2 English. Proof of two years of full-time study in English is accepted, so no IELTS is needed.', 'no',
   'yes', 'Takes Health Sciences degrees, so your PharmD fits.',
   '[{"label":"Scholarship round","opens":"11-01","closes":"12-31","confirmed":false},
     {"label":"Self-funded round","opens":null,"closes":"05-04","confirmed":false}]',
   'DAAD lists the scholarship round as 1 November to 31 December. The program''s own site still shows last cohort''s self-funded round (until 4 May), so the daily check watches its application page for the new call.',
   'https://master-emmah.eu/application-and-admission/application',
   'https://master-emmah.eu/application-and-admission/admission-and-selection',
   'https://master-emmah.eu/application-and-admission/application'),

  (45, 'Aalen University', 'MSc Health Technology Management',
   'Germany', 'Aalen', 'closest',
   'Manages health technology rather than building it. Close to health informatics, not the same.',
   '€1,500 per semester for non-EU students.', 'Deutschlandstipendium is available at the university.',
   'DAAD lists a B2 certificate (e.g. TOEFL). Check whether your English-taught degree is accepted instead.', 'unclear',
   'yes', 'Takes any three- or four-year degree.',
   '[{"label":"Winter semester","opens":"12-15","closes":"03-15","confirmed":true}]',
   'From the DAAD 2026/27 listing.',
   null,
   'https://www2.daad.de/deutschland/studienangebote/international-programmes/en/detail/10641/', null),

  (35, 'Deggendorf Institute of Technology', 'MSc Life Science Informatics',
   'Germany', 'Deggendorf', 'direct', null,
   '€500 per semester for non-EU students, plus the student union fee.', null,
   'DAAD lists a C1 certificate (e.g. IELTS 7) but says exemptions are on the course website.', 'unclear',
   'maybe', 'Takes biomedicine or informatics bachelor''s degrees and has an assessment test. Ask whether pharmacy counts.',
   '[{"label":"Winter semester","opens":"04-15","closes":"06-15","confirmed":true}]',
   'From the DAAD 2026/27 listing.',
   'https://www.th-deg.de/en/apply#international',
   'https://www2.daad.de/deutschland/studienangebote/international-programmes/en/detail/6399/', null);
