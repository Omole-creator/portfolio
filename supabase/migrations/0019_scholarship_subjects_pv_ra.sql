-- 2026-11-20: Omole widened the scholarship tracker beyond health
-- informatics and digital health to pharmacovigilance and regulatory
-- affairs. Each program now records which of the four subjects it covers
-- (one program can cover several), and /admin/scholarship can filter by
-- subject.
--
-- New programs came from the official course databases he named:
--   * DAAD International Programmes (Germany): searched pharmacovigilance,
--     regulatory affairs, drug regulatory, drug safety, pharmacology,
--     pharmacoepidemiology, clinical research/trials, medicines.
--   * Study in NL's Studyfinder (its /api/programs feed, all 1,710 programs):
--     nothing added. Every match (Utrecht's Epidemiology with its
--     Pharmacoepidemiology track, Utrecht's Drug Innovation, Groningen's
--     Medical Pharmaceutical Sciences, Tilburg's Digital Health) charges
--     non-EU students about €20,000-25,000 a year and asks for IELTS 6.5.
--   * Stipendium Hungaricum course list (all 1,024 courses): Debrecen's
--     pharmaceutical R&D management master, below. studyinhungary.hu itself
--     was down for maintenance on the day.
--   * studyprogrammes.ch (Switzerland, all 4,410 programmes): Basel's Drug
--     Sciences, below. The Swiss regulatory/pharmaceutical medicine offers
--     are continuing-education MAS/DAS courses at CHF 15,500-34,000.
--   * Left out because they're mostly or fully online, and every program has
--     to be onsite for a study visa: Bonn's Master of Drug Regulatory Affairs
--     (80% online, €9,900) and TH Lübeck's online MSc Regulatory Affairs.

alter table public.scholarship_programs
  add column subjects text[] not null default '{}'
    check (subjects <@ array['health_informatics','digital_health','pharmacovigilance','regulatory_affairs']::text[]);

-- Existing programs ----------------------------------------------------------

update public.scholarship_programs set subjects = '{digital_health}'
  where program ilike '%digital health%'
     or program ilike '%ehealth%'
     or program ilike '%medical technology%'
     or program ilike '%health technology%';

update public.scholarship_programs set subjects = '{health_informatics}'
  where subjects = '{}';

-- New programs ---------------------------------------------------------------

insert into public.scholarship_programs
  (sort_order, university, program, country, city, subjects, fit, fit_note, tuition_note, funding_note,
   english_note, ielts_required, background_fit, background_note, windows, windows_note,
   apply_url, info_url, watch_url)
values
  (3, 'University of Debrecen (Faculty of Pharmacy)',
   'MSc Pharmaceutical Research and Development Management',
   'Hungary', 'Debrecen', '{pharmacovigilance,regulatory_affairs}', 'direct',
   'Two years of pharmacovigilance, drug registration, clinical trial authorisation, GxP quality and project management, with a 4-week internship. The program started in 2025.',
   '6,000 USD a year if self-funded.',
   'Offered under Stipendium Hungaricum (Nigeria is eligible), which covers tuition, a monthly stipend and housing. As with every Stipendium Hungaricum course, Nigeria''s Department of Scholarship Awards also has to nominate you; the ministry''s notices are watched on the Debrecen Public Health entry.',
   'B2 English: IELTS 6.0, TOEFL 547, or an oral interview. The interview route means IELTS isn''t compulsory.', 'no',
   'yes', 'Lists pharmacy as an accepted degree. You need 2 references, a motivation letter and a subject entrance interview.',
   '[{"label":"Stipendium Hungaricum call","opens":"11-01","closes":"01-15","confirmed":false},
     {"label":"Self-funded (September start)","opens":null,"closes":"06-15","confirmed":true}]',
   'The self-funded deadline is from Debrecen''s own page. The Stipendium Hungaricum dates are last cycle''s; the course page on the Stipendium Hungaricum portal still said "not available for applying at the moment" on 20 November 2026, and the daily check watches it for the change.',
   'https://apply.stipendiumhungaricum.hu/courses/course/4431-msc-pharmaceutical-research-and-development-management',
   'https://edu.unideb.hu/p/pharmaceutical-research-and-development-manager-msc',
   'https://apply.stipendiumhungaricum.hu/courses/course/4431-msc-pharmaceutical-research-and-development-management'),

  (47, 'University of Basel', 'MSc Drug Sciences',
   'Switzerland', 'Basel', '{pharmacovigilance,regulatory_affairs}', 'closest',
   'A drug discovery and development degree (pharmacology, toxicology, efficacy and safety) that names regulatory agencies as a career path. It isn''t a pharmacovigilance or regulatory affairs program as such.',
   'CHF 850 per semester.', null,
   'Courses are in English. Basel''s language rules are on its Language Skills page; check which English proof it accepts.', 'unclear',
   'maybe', 'Foreign pharmacy degrees are assessed case by case, and you may first have to pass bachelor courses that are taught and examined in German.',
   '[{"label":"Autumn semester","opens":null,"closes":"04-30","confirmed":false}]',
   'The deadline is from the Swiss studyprogrammes.ch listing. Basel can set earlier deadlines for non-EU applicants, so confirm on the university''s admission pages.',
   'https://www.unibas.ch/en/Studies/Application-Admission.html',
   'https://pharma.unibas.ch/en/education/msc-drug-sciences/', null);
