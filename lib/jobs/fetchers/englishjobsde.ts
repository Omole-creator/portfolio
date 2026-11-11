import type { JobSource, NormalizedJob } from "../types";
import { extractPageText, fetchApplyPageText, titleLooksRelevant } from "./shared";

// English Jobs Germany (englishjobs.de) lists English-speaking roles across
// Germany. No API, but its search pages are plain server-rendered HTML
// (checked live 2026-11-11): each result is a `<div id="<id>" class="job
// js-job ...">` with the title in `itemprop="title"` and company/location
// as the first two `<li>`s, the date ("November 11", no year) as the third.
// Two kinds of result: ads posted on the site itself link to /job/<id>,
// which is fetched for the full text and used as the apply link (it holds
// the employer's application method); most results are pulled in from
// other boards and link to a signed /clickout/<id>?... redirect to the
// employer's page instead. Those have no page of their own here (/job/<id>
// is a 404 for them), so the employer page behind the clickout is read instead, with the
// listing snippet as the fallback when that page can't be read.
const BASE = "https://englishjobs.de";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Accept: "text/html",
};

const DEFAULT_QUERIES = [
  "marketing",
  "growth marketing",
  "content marketing",
  "social media",
  "copywriter",
  "web designer",
  "marketing visa sponsorship",
];

const MAX_DETAILS = 20;

const MONTHS =
  "January|February|March|April|May|June|July|August|September|October|November|December";
const DATE_PATTERN = new RegExp(`\\b(${MONTHS}) (\\d{1,2}), (20\\d\\d)\\b`);

function clean(html: string): string {
  return html
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

type Listing = {
  id: string;
  title: string;
  company: string;
  location: string;
  href: string;
  snippet: string;
  remoteTag: boolean;
  dateText: string;
};

/** "November 11" -> ISO date in the most recent year that isn't in the future. */
function listingDate(text: string): string | null {
  const match = text.match(new RegExp(`^(${MONTHS}) (\\d{1,2})$`));
  if (!match) return null;
  const now = new Date();
  let date = new Date(`${match[1]} ${match[2]}, ${now.getUTCFullYear()} UTC`);
  if (date.getTime() > now.getTime() + 86400000) {
    date = new Date(`${match[1]} ${match[2]}, ${now.getUTCFullYear() - 1} UTC`);
  }
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

async function searchPage(query: string): Promise<Listing[]> {
  const slug = query.trim().toLowerCase().replace(/\s+/g, "_");
  try {
    const res = await fetch(`${BASE}/jobs/${encodeURIComponent(slug)}_germany`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`English Jobs Germany "${query}" failed: ${res.status}`);
      return [];
    }
    const html = await res.text();
    const parts = html.split(/<div id="([^"]+)" class="job js-job/).slice(1);
    const listings: Listing[] = [];
    for (let i = 0; i + 1 < parts.length; i += 2) {
      const id = parts[i];
      const block = parts[i + 1].slice(0, 8000);
      const title = clean(block.match(/itemprop="title"[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? "");
      const items = [...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => clean(m[1]));
      const href = (block.match(/<a href="([^"]+)"[^>]*js-joblink/)?.[1] ?? "").replace(/&amp;/g, "&");
      const snippet = clean(block.match(/<div class="mr-4 flex-1[^"]*">([\s\S]*?)<\/div>/)?.[1] ?? "");
      if (!id || !title || !href) continue;
      listings.push({
        id,
        title,
        company: items[0] ?? "",
        location: items[1] ?? "",
        dateText: items[2] ?? "",
        remoteTag: items.some((item) => /remote/i.test(item)),
        href,
        snippet,
      });
    }
    return listings;
  } catch (error) {
    console.error(`English Jobs Germany "${query}" errored:`, error);
    return [];
  }
}

async function fetchDetail(id: string): Promise<{ text: string | null; postedAt: string | null }> {
  try {
    const res = await fetch(`${BASE}/job/${encodeURIComponent(id)}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return { text: null, postedAt: null };
    const text = extractPageText(await res.text(), 8000);
    const date = text.match(DATE_PATTERN);
    const postedAt = date ? new Date(`${date[1]} ${date[2]}, ${date[3]} UTC`).toISOString() : null;
    return { text: text || null, postedAt };
  } catch {
    return { text: null, postedAt: null };
  }
}

/** Never throws; degrades to []. board_token is "default" or a comma-separated list of search terms. */
export async function fetchEnglishJobsDeJobs(source: JobSource): Promise<NormalizedJob[]> {
  const token = source.board_token.trim();
  const queries =
    !token || token === "default"
      ? DEFAULT_QUERIES
      : token.split(",").map((q) => q.trim()).filter(Boolean);

  const results = await Promise.all(queries.map(searchPage));

  const seen = new Set<string>();
  const relevant: Listing[] = [];
  for (const listing of results.flat()) {
    if (seen.has(listing.id) || !titleLooksRelevant(listing.title)) continue;
    seen.add(listing.id);
    relevant.push(listing);
  }

  const picked = relevant.slice(0, MAX_DETAILS);
  const details = await Promise.all(
    picked.map((listing) =>
      listing.href.startsWith("/job/")
        ? fetchDetail(listing.id)
        : // A clickout redirects to the employer's own ad; read that for
          // the visa/relocation wording the short snippet usually lacks.
          fetchApplyPageText(`${BASE}${listing.href}`).then((text) => ({ text, postedAt: null })),
    ),
  );

  return picked.map((listing, i) => {
    let location = listing.location || "Germany";
    if (!/germany|deutschland/i.test(location)) location = `${location}, Germany`;
    if (listing.remoteTag) location = `Remote, ${location}`;
    return {
      ats: "englishjobsde" as const,
      external_id: listing.id,
      company_name: listing.company || "Unknown company",
      title: listing.title,
      location_text: location,
      apply_url: `${BASE}${listing.href}`,
      // Employer pages often come back as near-empty shells, so the
      // listing snippet is always kept alongside whatever they return.
      description_text: [listing.snippet, details[i].text].filter(Boolean).join(" ") || null,
      // null, not false: some ads here are remote, and classify.ts reads
      // "remote" from the location text when there's no structured flag.
      is_remote: null,
      posted_at: details[i].postedAt ?? listingDate(listing.dateText),
    };
  });
}
