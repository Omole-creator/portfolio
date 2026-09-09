import type { JobAts } from "./types";

// Every ATS in this repo has its own URL shape and response shape, keyed by
// the same short board token - so instead of making the admin guess which
// platform a company uses, this tries the token against all of them at
// once and reports back whichever ones actually returned a real board.
// "custom" and the remote-job aggregators (remoteok/remotive/jobicy/
// arbeitnow/himalayas/workingnomads) are excluded: none of them are
// identified by a per-company token the way these seven are, so there's
// nothing to probe or parse a URL for in the same shape as the others.
export type RealAts = Exclude<
  JobAts,
  "custom" | "remoteok" | "remotive" | "jobicy" | "arbeitnow" | "himalayas" | "workingnomads"
>;

export type AtsProbeResult = { ats: RealAts; jobCount: number };

const PROBEABLE: RealAts[] = [
  "greenhouse",
  "lever",
  "ashby",
  "workable",
  "smartrecruiters",
  "recruitee",
  "breezy",
];

function probeUrl(ats: RealAts, token: string): string {
  switch (ats) {
    case "greenhouse":
      return `https://boards-api.greenhouse.io/v1/boards/${token}/jobs`;
    case "lever":
      return `https://api.lever.co/v0/postings/${token}?mode=json`;
    case "ashby":
      return `https://api.ashbyhq.com/posting-api/job-board/${token}`;
    case "workable":
      return `https://apply.workable.com/api/v1/widget/accounts/${token}`;
    case "smartrecruiters":
      return `https://api.smartrecruiters.com/v1/companies/${token}/postings`;
    case "recruitee":
      return `https://${token}.recruitee.com/api/offers/`;
    case "breezy":
      return `https://${token}.breezy.hr/json`;
  }
}

/** Returns a job count if the response shape matches this platform's real API, null if the token doesn't exist there. */
function extractJobCount(ats: RealAts, data: unknown): number | null {
  if (data === null || data === undefined) return null;

  if (ats === "lever" || ats === "breezy") {
    return Array.isArray(data) ? data.length : null;
  }

  if (typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;

  if (ats === "greenhouse" || ats === "ashby") {
    return Array.isArray(obj.jobs) ? obj.jobs.length : null;
  }
  if (ats === "workable") {
    return typeof obj.name === "string" ? (Array.isArray(obj.jobs) ? obj.jobs.length : 0) : null;
  }
  if (ats === "smartrecruiters") {
    return Array.isArray(obj.content) ? obj.content.length : null;
  }
  if (ats === "recruitee") {
    return Array.isArray(obj.offers) ? obj.offers.length : null;
  }
  return null;
}

async function probeOne(ats: RealAts, token: string): Promise<AtsProbeResult | null> {
  try {
    const res = await fetch(probeUrl(ats, token), { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    const jobCount = extractJobCount(ats, data);
    return jobCount === null ? null : { ats, jobCount };
  } catch {
    return null;
  }
}

/** Tries a board token against every real ATS in parallel. Returns only the ones that actually matched. */
export async function detectAts(token: string): Promise<AtsProbeResult[]> {
  const results = await Promise.all(PROBEABLE.map((ats) => probeOne(ats, token)));
  return results.filter((r): r is AtsProbeResult => r !== null);
}

// The whole point of "add a source" should be "paste the URL you're looking
// at" - every platform's hosted job page puts the board token right in the
// URL, so it can just be read off, no separate lookup needed. Tried in
// order; the first pattern that matches wins.
const URL_PATTERNS: { ats: RealAts; pattern: RegExp }[] = [
  { ats: "greenhouse", pattern: /(?:job-)?boards\.greenhouse\.io\/([^/?#]+)/i },
  { ats: "lever", pattern: /jobs\.lever\.co\/([^/?#]+)/i },
  { ats: "ashby", pattern: /jobs\.ashbyhq\.com\/([^/?#]+)/i },
  { ats: "workable", pattern: /apply\.workable\.com\/([^/?#]+)/i },
  { ats: "workable", pattern: /([a-z0-9-]+)\.workable\.com/i },
  { ats: "smartrecruiters", pattern: /jobs\.smartrecruiters\.com\/([^/?#]+)/i },
  { ats: "recruitee", pattern: /([a-z0-9-]+)\.recruitee\.com/i },
  { ats: "breezy", pattern: /([a-z0-9-]+)\.breezy\.hr/i },
];

/**
 * Pure string matching, no network call - reads the board token straight
 * out of a pasted careers/job URL. Returns null when the URL doesn't match
 * any known platform (e.g. a company's own custom domain), in which case
 * the caller should fall back to ats: "custom" with the URL as-is.
 */
export function parseCareersUrl(url: string): { ats: RealAts; token: string } | null {
  for (const { ats, pattern } of URL_PATTERNS) {
    const match = pattern.exec(url);
    if (match?.[1]) return { ats, token: match[1] };
  }
  return null;
}
