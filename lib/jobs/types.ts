// "custom" isn't a real ATS - it's a best-effort scraper for a company's
// own bespoke careers page (see lib/jobs/fetchers/custom.ts), for when a
// company doesn't use any of the recognized platforms below. It's the
// fallback that lets literally any career page on the internet be added as
// a source, at the cost of being much noisier than a structured API.
export type JobAts =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "workable"
  | "smartrecruiters"
  | "recruitee"
  | "breezy"
  | "custom";
export type JobTrack = "growth" | "marketing";
export type JobSourceTrack = JobTrack | "both";
// Only matters as a tiebreaker for an ambiguous bare "Remote" posting with
// no other signal (see lib/jobs/classify.ts): "remote_global" lets those
// through for this source, anything else keeps them excluded by default,
// since a company's "Remote" listings are usually scoped to specific
// countries it already has payroll/legal set up for, not open worldwide.
export type JobRegionHint = "us" | "australia" | "us_or_australia" | "remote_global";
// Whether the posting is confirmed open to a candidate anywhere (including
// Nigeria/Africa), or only passed the filter on an "unconfirmed" basis (a
// bare "Remote" listing with no explicit scope, accepted only because its
// source is tagged remote_global) - surfaced in the admin UI so an
// "unconfirmed" match gets a second look before applying.
export type JobEligibility = "worldwide" | "unconfirmed";
export type JobMatchStatus = "new" | "prepared" | "applied" | "dismissed";

export type JobSource = {
  id: string;
  company_name: string;
  ats: JobAts;
  // For a real ATS: the short board/account token from the company's
  // careers URL (e.g. Greenhouse's "acme" in boards.greenhouse.io/acme).
  // For ats === "custom": the full URL of the company's careers/jobs page.
  board_token: string;
  region_hint: JobRegionHint;
  track: JobSourceTrack;
  active: boolean;
  created_at: string;
};

export type QaPair = { question: string; answer: string };

export type JobMatch = {
  id: string;
  source_id: string | null;
  ats: JobAts;
  external_id: string;
  company_name: string;
  title: string;
  location_text: string | null;
  eligibility: JobEligibility;
  apply_url: string;
  description_text: string | null;
  track: JobTrack;
  keyword_hits: string[];
  status: JobMatchStatus;
  cover_letter: string | null;
  qa_pairs: QaPair[] | null;
  extraction_ok: boolean | null;
  cv_path: string | null;
  portfolio_url: string | null;
  // A direct application email found on the apply page or in the job
  // description (see lib/jobs/extractQuestions.ts) - null when the
  // company only takes applications through a form. Only set once
  // "Prepare application" has run.
  apply_email: string | null;
  // When the drafted email was actually sent via Gmail. Distinguishes
  // "prepared, waiting on you to send" from "already sent" for
  // apply_email jobs, and guards against sending the same application
  // twice.
  email_sent_at: string | null;
  prepared_at: string | null;
  first_seen_at: string;
  updated_at: string;
};

// The shape every ATS fetcher normalizes its response into, before
// classification. description_text is always plain text, HTML stripped.
// is_remote is a real signal only from Ashby (which exposes it directly);
// Greenhouse and Lever don't expose a structured flag, so it stays null and
// classify.ts falls back to checking location_text for "remote".
export type NormalizedJob = {
  ats: JobAts;
  external_id: string;
  company_name: string;
  title: string;
  location_text: string | null;
  apply_url: string;
  description_text: string | null;
  is_remote: boolean | null;
};
