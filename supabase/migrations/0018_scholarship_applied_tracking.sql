-- /admin/scholarship now works like /admin/jobs: it shows only programs open
-- right now (or rolling), a "Mark applied" button moves a program into an
-- Applied section, and each applied program has independent milestone
-- toggles. Applied programs also stop sending "it's open" emails.

alter table public.scholarship_programs
  add column applied_at timestamptz,
  add column heard_back_at timestamptz,
  add column interview_at timestamptz,
  add column admitted_at timestamptz,
  add column funded_at timestamptz,
  add column rejected_at timestamptz;
