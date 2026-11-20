-- 2026-11-20, second sweep: Austria, Ireland, Canada, Erasmus Mundus and the
-- named scholarships (Swedish Institute, Maastricht NL-High Potential, ETH
-- ESOP, Swiss Government Excellence, RESCO, UK full scholarships). Omole's
-- rule for this pass: onsite only (the point is a study visa), and the UK
-- only when it's a 100% scholarship he qualifies for. Apply after 0019,
-- which adds the subjects column.
--
-- Checked and not added:
--   * RESCO is an Erasmus Mundus master in renewable energy and sustainable
--     construction for engineering graduates. Off-subject.
--   * Swiss Government Excellence Scholarships fund doctoral and postdoc
--     research, not master's (except art schools).
--   * Erasmus Mundus: no joint master in pharmacovigilance, regulatory
--     affairs or health informatics is in the catalogue. EMMaH (already
--     tracked) is the digital health one; Europubhealth+ needs a language
--     test. Eu2P (pharmacovigilance) is an online lifelong-learning master,
--     not an Erasmus Mundus degree.
--   * Ireland: UCC Pharmaceutical Regulatory Sciences (blended, €20,400),
--     UCD Regulatory Affairs & Toxicology (€25,600), TU Dublin Pharmaceutical
--     QA & Regulation (€21,750), SETU Pharmaceutical Regulatory Affairs
--     (~€15,000). None is low-cost or funded.
--   * Canada: Western's MSc Drug Safety and Pharmacovigilance (on campus,
--     international deadline 30 April) and Northeastern Toronto's MS
--     Regulatory Affairs (private) have no full funding for international
--     students.
--   * UK Commonwealth Master's Scholarships (2027/28 closed 20 October
--     2026). Commonwealth Shared Scholarships close 8 December 2026 but no
--     2027/28 course in these subjects had been published.

insert into public.scholarship_programs
  (sort_order, university, program, country, city, subjects, fit, fit_note, tuition_note, funding_note,
   english_note, ielts_required, background_fit, background_note, windows, windows_note,
   apply_url, info_url, watch_url)
values
  (2, 'Karolinska Institutet (joint with Stockholm University)',
   'Joint Master''s Programme in Health Informatics',
   'Sweden', 'Stockholm', '{health_informatics}', 'direct', null,
   'SEK 330,000 for the whole program for non-EU students, plus a SEK 900 application fee.',
   'On the Swedish Institute Scholarship for Global Professionals list for 2027/28. Nigeria is eligible, and SI covers tuition, living costs, travel and insurance. SI needs at least 3,000 hours of work experience (from at most three employers) before February 2027, plus leadership experience. Apply to the program first, then to SI.',
   'universityadmissions.se counts a completed four-year bachelor''s from a recognised Nigerian university as enough English proof, so no IELTS is needed.', 'no',
   'yes', 'Takes a healthcare bachelor''s of at least 180 credits, so your PharmD fits. Selection uses KI''s CV form, your work and research experience, and a statement of intent.',
   '[{"label":"University application (autumn 2027)","opens":"10-16","closes":"01-15","confirmed":true},
     {"label":"Swedish Institute scholarship","opens":"02-08","closes":"02-24","confirmed":true}]',
   'Supporting documents must reach universityadmissions.se by 1 February 2027. The SI portal closes at 14:59 CET on 24 February.',
   'https://www.universityadmissions.se/',
   'https://education.ki.se/programme/5hi17-joint-masters-programme-in-health-informatics',
   'https://si.se/en/apply/scholarships/swedish-institute-scholarships-for-global-professionals/'),

  (4, 'Maastricht University', 'MSc Health and Digital Transformation',
   'Netherlands', 'Maastricht', '{digital_health}', 'direct', null,
   'The non-EU fee applies unless you win the scholarship, which covers it. Check the amount on the program page.',
   'On the UM NL-High Potential scholarship list for 2027/28: tuition, about €20,150 for living costs over 13 months, insurance and visa costs. Only 21 awards across all eligible programs (about 2% of applicants), and your transcript must show at least 75% of the maximum grade (7.5 out of 10). A university room is mandatory.',
   'A degree taught only in English meets the requirement automatically; you upload proof, such as a letter from your university. Otherwise IELTS 7.0.', 'no',
   'yes', 'Pharmacy is on the program''s list of relevant degrees.',
   '[{"label":"Program application (needed for the scholarship)","opens":"10-01","closes":"12-10","confirmed":true},
     {"label":"NL-High Potential scholarship","opens":"10-01","closes":"02-01","confirmed":true}]',
   'To be considered for the scholarship, your Studielink application and full file must be in by 10 December 2026. The scholarship form closes on 1 February 2027. Without the scholarship, the non-EU program deadline is 1 May 2027.',
   'https://www.maastrichtuniversity.nl/education/master/programmes/health-and-digital-transformation/admission-requirements',
   'https://www.maastrichtuniversity.nl/education/master/programmes/health-and-digital-transformation',
   'https://www.maastrichtuniversity.nl/maastricht-university-nl-high-potential-scholarship'),

  (6, 'University of Innsbruck and Medical University of Innsbruck',
   'MSc Pharmaceutical Sciences – Drug Development and Regulatory Affairs',
   'Austria', 'Innsbruck', '{regulatory_affairs}', 'direct',
   'Full-time and on campus. Covers preclinical and clinical development and EU marketing authorisation, with lecturers from industry and regulators.',
   'Austrian public universities charge non-EU students about €730 per semester. Confirm on Innsbruck''s fees page.', null,
   'C1 English is required. The admission pages don''t say which proof is accepted; ask whether your English-taught degree counts.', 'unclear',
   'yes', 'Takes any subject-relevant bachelor''s, so pharmacy fits. Selection is a knowledge test (genetics, physiology, biology, chemistry) and an interview, both in person in Innsbruck, so you would need a visa just to attend them. About 30 places.',
   '[{"label":"Admission registration","opens":"03-02","closes":"05-06","confirmed":false}]',
   'These are the 2026 dates. Last year the test was on 3 July and the interviews on 9-10 July, in person. Registration costs €90.',
   'https://www.i-med.ac.at/studium/zulassung/zulassung_pharm_sci.html.en',
   'https://www.uibk.ac.at/en/programmes/ma-pharmaceutical-sciences/',
   'https://www.i-med.ac.at/studium/zulassung/zulassung_pharm_sci.html.en'),

  (8, 'ETH Zurich', 'MSc Pharmaceutical Sciences (with the ESOP scholarship)',
   'Switzerland', 'Zurich', '{regulatory_affairs}', 'closest',
   'Drug development with industry training. Not a regulatory affairs or pharmacovigilance program as such.',
   'ESOP waives tuition.',
   'ETH Excellence Scholarship (ESOP): CHF 13,500 per semester plus a tuition waiver, about 60 awards across ETH. Needs a top-10% bachelor''s result, a master''s thesis pre-proposal, a motivation letter and two letters from professors with a PhD at your university.',
   'C1. You''re exempt if your whole bachelor''s was taught only in English and your university''s registrar confirms it in writing.', 'no',
   'maybe', 'Takes pharmaceutical sciences, health sciences, biology or biomedicine bachelor''s degrees, judged on your course content including lab practicals.',
   '[{"label":"ESOP and master''s application","opens":"11-01","closes":"11-30","confirmed":true}]',
   'ESOP only goes to applications sent in this November window. It closes on 30 November at 11:59 CET (noon). Decisions come at the end of March.',
   'https://ethz.ch/en/studies/master/application.html',
   'https://ethz.ch/en/studies/master/application/master-pharmwiss.html',
   'https://ethz.ch/en/studies/financial/scholarships/excellencescholarship.html'),

  (12, 'Chevening (UK government), any eligible UK university',
   'Chevening Scholarship for a one-year UK master''s',
   'United Kingdom', null, '{health_informatics,digital_health,pharmacovigilance,regulatory_affairs}', 'direct',
   'A scholarship, not a program. You pick three eligible UK master''s when you apply, for example in pharmacovigilance, regulatory affairs or health informatics.',
   'Covered in full.',
   'Fully funded: tuition, a monthly stipend, flights and visa. Nigeria is eligible. Needs at least two years (2,800 hours) of work experience. You must return to Nigeria for at least two years after the course, which works against relocating.',
   'Chevening doesn''t require IELTS itself. Your chosen universities set their own rules, and many accept a degree taught in English from Nigeria.', 'no',
   'yes', 'Any bachelor''s degree qualifies for Chevening; each UK course sets its own entry rules.',
   '[{"label":"Chevening application","opens":"08-04","closes":"10-06","confirmed":false}]',
   'The 2027/28 round closed on 6 October 2026. These are last cycle''s dates; the next round (for 2028/29) should open in early August 2027.',
   'https://www.chevening.org/scholarships/nigeria/',
   'https://www.chevening.org/scholarships/nigeria/',
   'https://www.chevening.org/scholarships/application-timeline/');
