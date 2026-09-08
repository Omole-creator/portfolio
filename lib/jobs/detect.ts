import type { JobAts } from "./types";

// Every ATS in this repo has its own URL shape and response shape, keyed by
// the same short board token - so instead of making the admin guess which
// platform a company uses, this tries the token against all of them at
// once and reports back whichever ones actually returned a real board.
// "custom" is excluded: it takes a full careers page URL, not a token, so
// there's nothing to probe with the same shape as the others.

export type AtsProbeResult = { ats: Exclude<JobAts, "custom">; jobCount: number };

const PROBEABLE: Exclude<JobAts, "custom">[] = [
  "greenhouse",
  "lever",
  "ashby",
  "workable",
  "smartrecruiters",
  "recruitee",
  "breezy",
];

function probeUrl(ats: Exclude<JobAts, "custom">, token: string): string {
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
function extractJobCount(ats: Exclude<JobAts, "custom">, data: unknown): number | null {
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

async function probeOne(ats: Exclude<JobAts, "custom">, token: string): Promise<AtsProbeResult | null> {
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
