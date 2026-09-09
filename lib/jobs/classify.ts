import type { JobEligibility, JobSource, JobTrack, NormalizedJob } from "./types";

// Plain keyword lists, not a smart classifier. Bad matches get dismissed
// from /admin/jobs rather than engineered away here.
const GROWTH_KEYWORDS = [
  "growth marketing",
  "growth marketer",
  "growth lead",
  "growth manager",
  "performance marketing",
  "performance marketer",
  "paid acquisition",
  "paid media",
  "paid social",
  "user acquisition",
  "demand generation",
  "lifecycle marketing",
  "crm marketing",
  "growth hacker",
  "community growth",
  "conversion rate optimization",
  "cro specialist",
];

const MARKETING_KEYWORDS = [
  "creative marketing",
  "creative marketer",
  "content marketing",
  "content marketer",
  "brand marketing",
  "brand manager",
  "social media manager",
  "social media marketing",
  "content creator",
  "video marketing",
  "creative strategist",
  "copywriter",
  "marketing manager",
  "content strategist",
];

// Explicit signals that a posting is NOT open to someone applying from
// Nigeria/Africa: citizenship/work-authorization/residency requirements,
// or a flat refusal to sponsor. These override everything else.
const EXCLUSION_PATTERNS: RegExp[] = [
  /must be (a |an )?(u\.?s\.?|united states|australian|singapore(an)?)\s*citizen/i,
  /(u\.?s\.?|united states|australian|singapore(an)?)\s*citizenship (is )?required/i,
  // Matches both "authorized to work in the United States" and "authorized
  // to work for any employer in the United States" (confirmed live on a
  // real Himalayas-sourced posting: the original narrower pattern missed
  // this exact phrasing, and only an unrelated "unable to sponsor" pattern
  // elsewhere in this list happened to catch that one instead).
  /must be authorized to work( for [^.]*?)? in (the )?(united states|u\.?s\.?|australia|singapore)/i,
  /must (currently )?(be based|reside|be located) in (the )?(united states|u\.?s\.?|usa|australia|singapore)/i,
  /candidates? must (be based|reside|be located) in/i,
  /open (only )?to (residents|candidates) (based |located )?in (the )?(united states|u\.?s\.?|australia|singapore)/i,
  /must be (a )?permanent resident/i,
  /must hold (a )?valid singapore (work pass|employment pass)/i,
  /security clearance required/i,
  /unable to sponsor/i,
  /no visa sponsorship/i,
  /not able to (provide|offer) (visa )?sponsorship/i,
  /this role is (based|located) in (the )?(united states|u\.?s\.?|australia|singapore)(?! or)/i,
];

// Explicit signals that a posting IS open to a candidate anywhere,
// including Nigeria/Africa - either says so directly, names Africa/Nigeria,
// or is run through an employer-of-record platform that supports hiring
// almost anywhere.
const WORLDWIDE_PATTERNS: RegExp[] = [
  /remote[\s,-]*(anywhere|worldwide|global)/i,
  /work from anywhere/i,
  /open to candidates (globally|worldwide|anywhere)/i,
  /we hire (internationally|globally|worldwide)/i,
  /globally distributed/i,
  /\bdeel\b/i,
  /\bremote\.com\b/i,
  /\boyster\b/i,
  /\bpapaya global\b/i,
  /\bafrica\b/i,
  /\bnigeria\b/i,
];

// A bare location VALUE (not prose) that already says everything: remote
// job aggregators (Remotive, Jobicy) put this straight in a
// candidate_required_location-style field, e.g. "Worldwide" on its own
// with no other text.
const WORLDWIDE_LOCATION_VALUES = /\b(worldwide|anywhere|global)\b/i;

// Omole is targeting roles reachable with at most 4 years of experience.
// Two independent, deliberately blunt heuristics, matching this file's
// existing "plain keyword list, not a smart classifier" approach:
//
// 1. A title that's unambiguously a senior-tier role almost always wants
//    5+ years regardless of whether the posting spells out a number.
//    "Lead" is deliberately excluded from this list even though it reads
//    senior in some companies - GROWTH_KEYWORDS above targets "growth
//    lead" directly, and plenty of "growth lead" openings at small
//    startups are a 2-4 year role, not a director-equivalent one.
// 2. An explicit "N years of experience" style requirement in the
//    description. Only the smaller number in a range counts (a "3-5
//    years" posting is reachable with 3), and a number only counts if the
//    word "experience" appears in a short window after it, so an unrelated
//    number of years (company age, funding history) doesn't trigger a
//    false exclusion.
const MAX_YEARS_EXPERIENCE = 4;

const SENIOR_TITLE_PATTERN =
  /\b(senior|sr\.?|staff|principal|director|vice president|vp|head of|chief|executive)\b/i;

const EXPERIENCE_YEARS_PATTERN = /(\d{1,2})\s*(?:\+|-|to)?\s*(?:\d{1,2})?\+?\s*years?/gi;

function requiresTooMuchExperience(text: string): boolean {
  for (const match of text.matchAll(EXPERIENCE_YEARS_PATTERN)) {
    const years = Number(match[1]);
    if (!Number.isFinite(years) || years <= MAX_YEARS_EXPERIENCE) continue;
    const start = match.index ?? 0;
    const window = text.slice(start, start + (match[0]?.length ?? 0) + 40).toLowerCase();
    if (window.includes("experience")) return true;
  }
  return false;
}

// Omole wants only postings from the last week - a role that's been open
// longer than that is more likely to already have a shortlist. posted_at is
// only as reliable as each ATS's own data (see NormalizedJob): when a
// source doesn't expose a posting date at all, there's no signal to filter
// on, so an unknown date is let through rather than excluded.
const MAX_POSTING_AGE_DAYS = 7;

function isTooOld(postedAt: string | null): boolean {
  if (!postedAt) return false;
  const posted = new Date(postedAt).getTime();
  if (Number.isNaN(posted)) return false;
  return Date.now() - posted > MAX_POSTING_AGE_DAYS * 24 * 60 * 60 * 1000;
}

function findHits(haystack: string, keywords: string[]): string[] {
  return keywords.filter((keyword) => haystack.includes(keyword));
}

function isRemoteJob(job: NormalizedJob): boolean {
  if (job.is_remote === true) return true;
  if (job.is_remote === false) return false;
  if ((job.location_text ?? "").toLowerCase().includes("remote")) return true;
  // The custom scraper (lib/jobs/fetchers/custom.ts) has no structured
  // location field at all, so this is the only signal it can offer -
  // whether the job's own page mentions "remote" anywhere in its text.
  return (job.description_text ?? "").toLowerCase().includes("remote");
}

/**
 * Once a job is already known to be remote (isRemoteJob), a location value
 * naming a specific place other than Africa/Nigeria means it's scoped to
 * that place, not open worldwide - whether that's Greenhouse-style "Remote,
 * Italy" (the word "remote" literally in the string), an Ashby posting
 * whose is_remote flag is true but whose location text is just an office
 * city like "New York, NY (HQ)" (no "remote" wording at all, just a
 * structural flag elsewhere), or an aggregator's candidate_required_location
 * field with a bare value like "USA". All three cases mean the same thing
 * once is_remote is already established: strip the word "remote" if it's
 * there, and anything left over is a scope.
 *
 * "EMEA" is treated the same as a literal Africa/Nigeria mention - it's the
 * standard corporate acronym for Europe, Middle East, and Africa, so a role
 * scoped "Home based - EMEA" (confirmed live on real Canonical postings)
 * factually includes Nigeria even though the word "Africa" never appears.
 * "APAC" and "Americas" get no such exception - neither includes Africa.
 */
function remoteNamesOtherCountry(locationText: string | null): boolean {
  const location = (locationText ?? "").toLowerCase().trim();
  if (!location) return false;
  if (/africa|nigeria|\bemea\b/.test(location)) return false;
  const withoutRemote = location.replace(/\bremote\b/g, "").replace(/[\s,()-]/g, "");
  return withoutRemote.length > 0;
}

function checkEligibility(
  job: NormalizedJob,
  hiresGlobally: boolean,
): JobEligibility | "excluded" {
  const text = `${job.location_text ?? ""} ${job.description_text ?? ""}`;

  if (EXCLUSION_PATTERNS.some((pattern) => pattern.test(text))) return "excluded";
  if (WORLDWIDE_PATTERNS.some((pattern) => pattern.test(text))) return "worldwide";
  if (job.location_text && WORLDWIDE_LOCATION_VALUES.test(job.location_text)) return "worldwide";
  if (remoteNamesOtherCountry(job.location_text)) return "excluded";

  // A bare "Remote" listing with no other signal - only let it through if
  // this source is known to hire globally; otherwise the safe default is
  // to exclude, since most companies scope "Remote" to specific countries
  // they already have payroll set up for.
  return hiresGlobally ? "unconfirmed" : "excluded";
}

/**
 * Decides whether a posting belongs on /admin/jobs at all: it must match a
 * tracked keyword, be remote, and clear the eligibility check above (a
 * candidate applying from Nigeria/Africa needs to actually be hireable for
 * it). Returns null to reject the job outright (not inserted).
 */
export function classifyJob(
  job: NormalizedJob,
  source: JobSource,
): { track: JobTrack; keyword_hits: string[]; eligibility: JobEligibility } | null {
  if (!isRemoteJob(job)) return null;
  if (isTooOld(job.posted_at)) return null;
  if (SENIOR_TITLE_PATTERN.test(job.title)) return null;
  if (requiresTooMuchExperience(`${job.title} ${job.description_text ?? ""}`)) return null;

  const haystack = `${job.title} ${job.description_text ?? ""}`.toLowerCase();

  const growthHits = findHits(haystack, GROWTH_KEYWORDS);
  const marketingHits = findHits(haystack, MARKETING_KEYWORDS);

  let track: JobTrack | null = null;
  let keywordHits: string[] = [];

  if (source.track === "growth" && growthHits.length) {
    track = "growth";
    keywordHits = growthHits;
  } else if (source.track === "marketing" && marketingHits.length) {
    track = "marketing";
    keywordHits = marketingHits;
  } else if (source.track === "both" && (growthHits.length || marketingHits.length)) {
    track = growthHits.length >= marketingHits.length ? "growth" : "marketing";
    keywordHits = track === "growth" ? growthHits : marketingHits;
  } else if (growthHits.length || marketingHits.length) {
    // The source is tagged for one track but this particular posting only
    // matched keywords from the other - use whichever actually matched
    // rather than dropping it.
    track = growthHits.length >= marketingHits.length ? "growth" : "marketing";
    keywordHits = track === "growth" ? growthHits : marketingHits;
  }

  if (!track) return null;

  const eligibility = checkEligibility(job, source.hires_globally);
  if (eligibility === "excluded") return null;

  return { track, keyword_hits: keywordHits, eligibility };
}
