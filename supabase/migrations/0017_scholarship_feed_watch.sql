-- Stipendium Hungaricum needs a second application in Nigeria: nomination by
-- the Federal Ministry of Education's Department of Scholarship Awards
-- (formerly the Federal Scholarship Board), whose deadline is often earlier
-- than the Stipendium Hungaricum portal's. The ministry site runs on
-- WordPress, so its search feed for "hungary" lists every notice that
-- mentions Hungary. The daily check now also reads an optional RSS feed per
-- program and emails when a new item appears (see readFeed in
-- lib/scholarships/check.ts).

alter table public.scholarship_programs
  add column feed_url text,
  add column feed_label text;

update public.scholarship_programs set
  funding_note = 'Stipendium Hungaricum (Nigeria is a partner country) covers tuition, a monthly stipend and housing. It takes two applications: one on the Stipendium Hungaricum portal, and a nomination from Nigeria''s Department of Scholarship Awards at the Federal Ministry of Education (formerly the Federal Scholarship Board). The Nigerian deadline is often earlier, so apply there as soon as it opens.',
  windows_note = 'Last cycle''s call opened in mid-November 2025 and closed on 15 January 2026. As of 11 November 2026 the Hungarian embassy in Abuja says the 2027/28 call isn''t out yet. The daily check watches the Stipendium Hungaricum site for the call, and the ministry''s notices for anything mentioning Hungary.',
  feed_url = 'https://education.gov.ng/search/hungary/feed/rss2/',
  feed_label = 'the Federal Ministry of Education site (notices mentioning Hungary)'
  where university = 'University of Debrecen';
