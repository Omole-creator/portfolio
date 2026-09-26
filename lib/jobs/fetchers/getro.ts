import type { JobSource, NormalizedJob } from "../types";
import { SENIOR_TITLE_PATTERN } from "../classify";
import { fetchApplyPageText, titleLooksRelevant } from "./shared";

// Getro powers the portfolio job boards of many venture capital firms
// (jobs.generalcatalyst.com, jobs.accel.com, jobs.8vc.com, ...): one page
// per VC listing open roles at the startups it has funded, much like
// Wellfound. Its search pages are server-rendered by Next.js and carry the
// results in __NEXT_DATA__, with the keyword in `q` and a base64 JSON
// `filter` param narrowing to remote roles (confirmed live 2026-09-26).
// Each listing's `url` goes to the employer's own apply page, so no
// account is needed. A page returns the 20 newest results and paging is
// client-side only, so coverage comes from several keyword searches.
//
// Listings carry no description, so for each remote, relevant, non-senior
// title the employer's apply page is fetched and its text used instead.
type GetroJob = {
  id: number;
  title: string;
  url: string;
  workMode: string | null;
  locations: string[] | null;
  createdAt: number | null;
  organization: { name: string; headCount: number | null } | null;
};

const QUERIES = [
  "marketing",
  "growth",
  "content",
  "social media",
  "brand",
  "community",
  "web designer",
];

// Getro's headCount is a size bucket, not a number: confirmed live, 2 was a
// pre-seed startup, 4 a Series D company of a few hundred people, 5 Monzo.
// Anything above 3 is dropped to keep to smaller companies, the same "no
// big companies" rule the rest of the sources follow. Unknown size is kept.
const MAX_HEADCOUNT_BUCKET = 3;
// Apply-page fetches per board per sync, so one busy board can't stall the cron.
const MAX_DETAIL_FETCHES = 15;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Accept: "text/html",
};

const REMOTE_FILTER = Buffer.from(
  JSON.stringify({ work_mode: ["remote"] }),
).toString("base64");

async function fetchSearch(host: string, query: string): Promise<GetroJob[]> {
  const params = new URLSearchParams({ q: query, filter: REMOTE_FILTER });
  try {
    const res = await fetch(`https://${host}/jobs?${params}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`Getro ${host} "${query}" fetch failed: ${res.status}`);
      return [];
    }
    const html = await res.text();
    const match = html.match(
      /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
    );
    if (!match) return [];
    const data = JSON.parse(match[1]);
    return data?.props?.pageProps?.initialState?.jobs?.found ?? [];
  } catch (err) {
    console.error(`Getro ${host} "${query}" fetch failed:`, err);
    return [];
  }
}

/**
 * A Getro-hosted VC portfolio board. `board_token` is the board's host
 * (e.g. "jobs.8vc.com"). Never throws; degrades to [].
 */
export async function fetchGetroJobs(
  source: JobSource,
): Promise<NormalizedJob[]> {
  const host = source.board_token
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");

  const jobs = new Map<number, GetroJob>();
  const searches = await Promise.all(
    QUERIES.map((query) => fetchSearch(host, query)),
  );
  for (const found of searches) {
    for (const job of found) {
      if (jobs.has(job.id) || job.workMode !== "remote") continue;
      if (
        !titleLooksRelevant(job.title) ||
        SENIOR_TITLE_PATTERN.test(job.title)
      )
        continue;
      const size = job.organization?.headCount;
      if (size != null && size > MAX_HEADCOUNT_BUCKET) continue;
      jobs.set(job.id, job);
    }
  }

  return Promise.all(
    [...jobs.values()]
      .slice(0, MAX_DETAIL_FETCHES)
      .map(async (job): Promise<NormalizedJob> => {
        const locations = (job.locations ?? []).filter(Boolean);
        return {
          ats: "getro",
          // Getro ids are global across every board it hosts, so the same
          // posting listed by two VCs dedupes to one match.
          external_id: String(job.id),
          company_name: job.organization?.name ?? "Unknown company",
          title: job.title.trim(),
          location_text: locations.length ? locations.join("; ") : "Remote",
          apply_url: job.url,
          description_text: await fetchApplyPageText(job.url),
          is_remote: true,
          posted_at: job.createdAt
            ? new Date(job.createdAt * 1000).toISOString()
            : null,
        };
      }),
  );
}
