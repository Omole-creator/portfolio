// "custom" isn't a real ATS - it's a best-effort scraper for a company's
// own bespoke careers page (see lib/jobs/fetchers/custom.ts), for when a
// company doesn't use any of the recognized platforms below. It's the
// fallback that lets literally any career page on the internet be added as
// a source, at the cost of being much noisier than a structured API.
//
// "remoteok" / "remotive" / "jobicy" / "arbeitnow" / "himalayas" are a
// different kind of source: free public remote-job aggregator APIs, each
// already covering thousands of companies rather than one company per
// source row. They exist because there's no way to search "every company
// on Greenhouse/Lever" for free - individually adding companies one at a
// time doesn't scale to meaningful coverage, so these fill that gap. Every
// job that comes through them still passes the exact same track/remote/
// eligibility filters as everything else in lib/jobs/classify.ts. Of the
// five, only Himalayas' keyword search (the `q` param) was confirmed live
// to actually narrow results - Remotive's `category` and Jobicy's `tag`
// params were tested and found to return the same unfiltered set
// regardless of value, so those two just fetch their general feed and rely
// on classify.ts to do the real filtering.
export type JobAts =
  | "greenhouse"
  | "lever"
  | "ashby"
  | "workable"
  | "smartrecruiters"
  | "recruitee"
  | "breezy"
  | "custom"
  | "remoteok"
  | "remotive"
  | "jobicy"
  | "arbeitnow"
  | "himalayas";
// "web" is the AI-assisted rapid web/product builder track, matched to
// /web's positioning (design + development + copy, moving fast with AI
// tools like Claude Code, not a traditional CS-background engineer) - see
// lib/web-content.ts and Omole Usuangbon - Web Developer CV.pdf.
export type JobTrack = "growth" | "marketing" | "web";
export type JobSourceTrack = JobTrack | "both";
// Whether the posting is confirmed open to a candidate anywhere (including
// Nigeria/Africa), or only passed the filter on an "unconfirmed" basis (a
// bare "Remote" listing with no explicit scope, accepted only because its
// source's hires_globally is true) - surfaced in the admin UI so an
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
  // For an aggregator ats (remoteok/remotive/jobicy/arbeitnow): a
  // category/tag filter passed straight to that API (e.g. "marketing"),
  // not a company token - there's no single company to identify.
  board_token: string;
  // Only matters as a tiebreaker for an ambiguous bare "Remote" posting with
  // no other eligibility signal (see lib/jobs/classify.ts): true lets those
  // through for this source (marked "unconfirmed" in job_matches), false
  // keeps them excluded by default, since a company's "Remote" listings are
  // usually scoped to specific countries it already has payroll/legal set
  // up for, not open worldwide. This is your own judgment about the
  // company, not something detected automatically.
  hires_globally: boolean;
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
  // When the company actually posted this job, per the ATS's own data -
  // null when the source doesn't expose one (see NormalizedJob.posted_at).
  // Distinct from first_seen_at, which is when our own sync first found it.
  posted_at: string | null;
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
  // ISO timestamp of when the company actually posted this job, straight
  // from the ATS's own data (confirmed live per platform: Greenhouse's
  // first_published, Lever's createdAt, Ashby's publishedAt, RemoteOK's
  // date, Remotive's publication_date, Jobicy's pubDate, Arbeitnow's and
  // Himalayas' pubDate/created_at). null when a source exposes no such
  // field at all - classify.ts's freshness gate treats null as "unknown
  // age" and lets it through rather than guessing.
  posted_at: string | null;
};
