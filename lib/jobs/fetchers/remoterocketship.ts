import type { JobSource, NormalizedJob } from "../types";

// Remote Rocketship (remoterocketship.com) collects remote roles straight
// from thousands of companies' own hiring systems (Greenhouse, Ashby,
// Workday, BambooHR, iCIMS...) and has no public API, but its search pages
// are server-rendered by Next.js and carry each result's data in
// __NEXT_DATA__ (confirmed live 2026-09-26 with a plain fetch). Each
// listing's `url` is the employer's own apply page, so no account is
// needed to apply.
//
// Its own `locations=Nigeria` filter does most of the eligibility work:
// it returns only roles that are open worldwide or that list Nigeria among
// their allowed countries (confirmed live: every result was "Worldwide" or
// carried Nigeria in locationCountries). Each search page returns 20
// results and `page=` is ignored, so coverage comes from running several
// narrow keyword searches rather than paging one broad one.
type RocketshipJob = {
  id: number;
  created_at: string;
  roleTitle: string;
  url: string;
  location: string | null;
  locationCountries: string[] | null;
  locationType: string | null;
  jobDescriptionSummary: string | null;
  twoLineJobDescriptionSummary: string | null;
  roleDescription: string | null;
  roleRequirements: string | null;
  salaryRange: { salaryHumanReadableText?: string | null } | null;
  company: { name: string } | null;
};

const DEFAULT_QUERIES = [
  "marketing",
  "growth",
  "content",
  "social media",
  "copywriter",
  "community",
  "brand",
  "web designer",
];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Accept: "text/html",
};

async function fetchSearch(query: string): Promise<RocketshipJob[]> {
  const params = new URLSearchParams({
    jobTitle: query,
    locations: "Nigeria",
    seniority: "entry-level,junior,mid-level",
  });
  try {
    const res = await fetch(
      `https://www.remoterocketship.com/remote-jobs/?${params}`,
      {
        headers: HEADERS,
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!res.ok) {
      console.error(`Remote Rocketship "${query}" fetch failed: ${res.status}`);
      return [];
    }
    const html = await res.text();
    const match = html.match(
      /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    );
    if (!match) return [];
    const data = JSON.parse(match[1]);
    return data?.props?.pageProps?.initialJobOpenings ?? [];
  } catch (err) {
    console.error(`Remote Rocketship "${query}" fetch failed:`, err);
    return [];
  }
}

// "Worldwide" passes classify.ts as-is. A country-scoped listing that
// includes Nigeria is written out with its full country list, which
// classify.ts's remoteNamesOtherCountry lets through because it names
// Nigeria (the bare `location` field alone would say just "Egypt").
function locationFor(job: RocketshipJob): string {
  const countries = job.locationCountries ?? [];
  if (countries.length) return `Remote (${countries.join("; ")})`;
  return `Remote, ${job.location || "Worldwide"}`;
}

/**
 * Remote Rocketship search, filtered to roles open to someone in Nigeria.
 * `board_token` is an optional comma-separated list of job-title searches
 * (e.g. "marketing,copywriter"); "default" (or empty) uses DEFAULT_QUERIES.
 * Never throws; degrades to [].
 */
export async function fetchRemoteRocketshipJobs(
  source: JobSource,
): Promise<NormalizedJob[]> {
  const token = source.board_token.trim();
  const queries =
    token && token.toLowerCase() !== "default"
      ? token
          .split(",")
          .map((q) => q.trim())
          .filter(Boolean)
      : DEFAULT_QUERIES;

  const jobs = new Map<number, RocketshipJob>();
  const searches = await Promise.all(queries.map(fetchSearch));
  for (const found of searches) {
    for (const job of found) {
      if (job.locationType !== "remote" || jobs.has(job.id)) continue;
      jobs.set(job.id, job);
    }
  }

  return [...jobs.values()].map((job) => {
    const description = [
      job.twoLineJobDescriptionSummary || job.jobDescriptionSummary,
      job.roleDescription,
      job.roleRequirements,
      job.salaryRange?.salaryHumanReadableText
        ? `Salary: ${job.salaryRange.salaryHumanReadableText}.`
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      ats: "remoterocketship" as const,
      external_id: String(job.id),
      company_name: job.company?.name ?? "Unknown company",
      title: job.roleTitle.trim(),
      location_text: locationFor(job),
      apply_url: job.url,
      description_text: description || null,
      is_remote: true,
      posted_at: job.created_at ? new Date(job.created_at).toISOString() : null,
    };
  });
}
