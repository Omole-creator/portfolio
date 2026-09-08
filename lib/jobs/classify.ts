import type {
  JobEligibility,
  JobRegionHint,
  JobSource,
  JobTrack,
  NormalizedJob,
} from "./types";

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
  /must be (a |an )?(u\.?s\.?|united states|australian)\s*citizen/i,
  /(u\.?s\.?|united states|australian)\s*citizenship (is )?required/i,
  /must be authorized to work in the (united states|u\.?s\.?|australia)/i,
  /must (currently )?(be based|reside|be located) in (the )?(united states|u\.?s\.?|usa|australia)/i,
  /candidates? must (be based|reside|be located) in/i,
  /open (only )?to (residents|candidates) (based |located )?in (the )?(united states|u\.?s\.?|australia)/i,
  /must be (a )?permanent resident/i,
  /security clearance required/i,
  /unable to sponsor/i,
  /no visa sponsorship/i,
  /not able to (provide|offer) (visa )?sponsorship/i,
  /this role is (based|located) in (the )?(united states|u\.?s\.?|australia)(?! or)/i,
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
 * A location like "Remote, Italy" or "Remote (US)" names a specific
 * country alongside "remote" - on Greenhouse/Lever/Ashby that almost always
 * means the req is scoped to hire someone already based there, not open
 * worldwide. A bare "Remote" with nothing else attached doesn't make that
 * claim either way.
 */
function remoteNamesOtherCountry(locationText: string | null): boolean {
  const location = (locationText ?? "").toLowerCase();
  if (!location.includes("remote")) return false;
  if (/africa|nigeria/.test(location)) return false;
  const withoutRemote = location.replace(/remote/g, "").replace(/[\s,()-]/g, "");
  return withoutRemote.length > 0;
}

function checkEligibility(
  job: NormalizedJob,
  regionHint: JobRegionHint,
): JobEligibility | "excluded" {
  const text = `${job.location_text ?? ""} ${job.description_text ?? ""}`;

  if (EXCLUSION_PATTERNS.some((pattern) => pattern.test(text))) return "excluded";
  if (WORLDWIDE_PATTERNS.some((pattern) => pattern.test(text))) return "worldwide";
  if (remoteNamesOtherCountry(job.location_text)) return "excluded";

  // A bare "Remote" listing with no other signal - only let it through if
  // this source is known to hire globally; otherwise the safe default is
  // to exclude, since most companies scope "Remote" to specific countries
  // they already have payroll set up for.
  return regionHint === "remote_global" ? "unconfirmed" : "excluded";
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

  const eligibility = checkEligibility(job, source.region_hint);
  if (eligibility === "excluded") return null;

  return { track, keyword_hits: keywordHits, eligibility };
}
