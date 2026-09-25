import type { JobSource, NormalizedJob } from "../types";
import { stripHtml, titleLooksRelevant } from "./shared";

// Y Combinator's Work at a Startup. No public API, but the site's own
// search box calls a public JSON endpoint (/jobs/search?q=..., up to 30
// results per query, no auth), and each job's public page embeds its full
// data (description, location, visa policy, minimum experience) as the
// Inertia `data-page` JSON attribute. Both confirmed live 2026-09-25 with a
// plain fetch, no browser needed. Neither exposes a posting date, so
// posted_at stays null (classify.ts lets an unknown date through).
//
// Applying needs a YC account. That breaks the usual "no account sign-up"
// rule for job sources on purpose: Omole named Wellfound and Work at a
// Startup as the only two exceptions.
type WaasSearchJob = {
  id: number;
  title: string;
  location?: string | null;
  companyName: string;
};

type WaasJobDetail = {
  id: number;
  title: string;
  location?: string | null;
  sponsorsVisa?: string | null;
  minExperience?: string | null;
  salaryRange?: string | null;
  descriptionHtml?: string | null;
};

const BASE = "https://www.workatastartup.com";

// Broad on purpose - classify.ts's title keywords decide what actually fits.
const DEFAULT_QUERIES = [
  "marketing",
  "growth",
  "content",
  "social media",
  "copywriter",
  "brand",
  "product marketing",
  "community",
  "video",
  "web designer",
  "website",
  "landing page",
  "vibe coding",
  "ai marketing",
];

// Each kept job costs one more request for its detail page, so this caps
// how long one sync spends on this source.
const MAX_DETAIL_FETCHES = 40;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
};

function decodeAttr(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function search(query: string): Promise<WaasSearchJob[]> {
  try {
    const res = await fetch(`${BASE}/jobs/search?q=${encodeURIComponent(query)}`, {
      headers: { ...HEADERS, Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Work at a Startup search "${query}" failed: ${res.status}`);
      return [];
    }
    const data = (await res.json()) as { jobs?: WaasSearchJob[] };
    return data.jobs ?? [];
  } catch (err) {
    console.error(`Work at a Startup search "${query}" failed:`, err);
    return [];
  }
}

async function fetchDetail(id: number): Promise<WaasJobDetail | null> {
  try {
    const res = await fetch(`${BASE}/jobs/${id}`, {
      headers: { ...HEADERS, Accept: "text/html" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();
    const match = html.match(/data-page="([^"]*)"/);
    if (!match) return null;
    return JSON.parse(decodeAttr(match[1]))?.props?.job ?? null;
  } catch {
    return null;
  }
}

/**
 * Turns WAAS's location plus its structured visa field into a location
 * string classify.ts already understands. A bare "Remote" role whose visa
 * field says "US citizenship/visa not required" is open to candidates
 * outside the US, so it's labeled as open anywhere; everything else keeps
 * its own location text ("Remote (US)", a city, etc.) and goes through
 * the normal eligibility checks.
 */
function locationFor(detail: WaasJobDetail): string | null {
  const location = (detail.location ?? "").trim();
  const bareRemote = /^remote(\s*\/\s*remote)?$/i.test(location);
  if (bareRemote && /not required/i.test(detail.sponsorsVisa ?? "")) {
    return "Remote, anywhere (US work authorization not required)";
  }
  return location || null;
}

/**
 * `board_token` is an optional comma-separated list of search queries
 * (e.g. "marketing,web designer"); "default" (or empty) uses
 * DEFAULT_QUERIES. Never
 * throws; degrades to [].
 */
export async function fetchWorkAtAStartupJobs(source: JobSource): Promise<NormalizedJob[]> {
  const token = source.board_token.trim();
  const queries =
    token && token.toLowerCase() !== "default"
      ? token.split(",").map((q) => q.trim()).filter(Boolean)
      : DEFAULT_QUERIES;

  const found = new Map<number, WaasSearchJob>();
  for (const query of queries) {
    for (const job of await search(query)) {
      if (!found.has(job.id) && titleLooksRelevant(job.title)) found.set(job.id, job);
    }
  }

  const jobs: NormalizedJob[] = [];
  for (const job of [...found.values()].slice(0, MAX_DETAIL_FETCHES)) {
    const detail = await fetchDetail(job.id);
    if (!detail) continue;

    // "US citizen/visa only" means the company won't hire anyone who
    // doesn't already have US work authorization.
    if (/citizen\/visa only/i.test(detail.sponsorsVisa ?? "")) continue;

    const location = locationFor(detail);
    const description = [
      detail.descriptionHtml ? stripHtml(detail.descriptionHtml) : "",
      detail.minExperience ? `Requires ${detail.minExperience} of experience.` : "",
      detail.salaryRange ? `Salary: ${detail.salaryRange}.` : "",
      detail.sponsorsVisa ? `Visa: ${detail.sponsorsVisa}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    jobs.push({
      ats: "workatastartup",
      external_id: String(job.id),
      company_name: job.companyName,
      title: (detail.title || job.title).trim(),
      location_text: location,
      apply_url: `${BASE}/jobs/${job.id}`,
      description_text: description || null,
      is_remote: /remote/i.test(location ?? "") ? true : null,
      posted_at: null,
    });
  }

  return jobs;
}
