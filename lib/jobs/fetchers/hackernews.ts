import type { JobSource, NormalizedJob } from "../types";
import { stripHtml, titleLooksRelevant } from "./shared";

// Hacker News' monthly "Ask HN: Who is hiring?" thread, read through
// Algolia's free public HN search API (hn.algolia.com, no auth). Every
// top-level comment is one company's post, written by the founder or
// hiring team, and by convention its first line is a pipe-separated
// header: "Company | Role, Role | REMOTE (Worldwide) | Full-time | url".
// Unlike YC's Work at a Startup, founders here often say outright whether
// remote means worldwide ("REMOTE (Global)", "Remote, anywhere") or one
// country ("REMOTE (US only)"), which is the signal classify.ts needs.
// Applying is by email or the company's own site, so no account is needed.
//
// One post often lists several roles, most of them engineering. Each
// relevant-looking role phrase becomes its own job here, so classify.ts
// judges "Founding Marketer" on its own title instead of rejecting the
// whole post because it also mentions "Senior Engineer".

const ALGOLIA = "https://hn.algolia.com/api/v1";

type HnStory = { objectID: string; title: string; created_at: string };
type HnComment = {
  objectID: string;
  parent_id: number;
  comment_text?: string | null;
  created_at: string;
};

const LOCATION_PATTERN = /remote|onsite|on-site|hybrid|worldwide|anywhere|global|in[- ]office/i;

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      console.error(`Hacker News fetch failed: ${res.status} ${url}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("Hacker News fetch failed:", err);
    return null;
  }
}

/**
 * The latest "Who is hiring?" thread, plus the previous month's while the
 * new one is under a week old, since a fresh thread has few posts yet and
 * last month's roles are usually still open.
 */
async function hiringThreads(): Promise<HnStory[]> {
  const data = await getJson<{ hits: HnStory[] }>(
    `${ALGOLIA}/search_by_date?tags=story,author_whoishiring&hitsPerPage=10`,
  );
  const threads = (data?.hits ?? []).filter((s) => /who is hiring/i.test(s.title));
  if (!threads.length) return [];
  const ageDays = (Date.now() - new Date(threads[0].created_at).getTime()) / 86_400_000;
  return ageDays < 7 ? threads.slice(0, 2) : threads.slice(0, 1);
}

function toText(html: string): string {
  // Keep paragraph breaks as newlines so the header line and any role
  // lists stay separable, then let stripHtml decode entities and tags.
  return html
    .split(/<p>/i)
    .map((part) => stripHtml(part.replace(/&#x2F;/g, "/").replace(/&#x27;/g, "'")))
    .join("\n");
}

function cleanPhrase(phrase: string): string {
  return phrase
    .replace(/^[\s\-*•·–]+/, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Role phrases worth classifying: pieces of the header and short lines in the body. */
function rolePhrases(header: string, bodyLines: string[]): string[] {
  const pieces = header
    .split("|")
    .slice(1)
    .flatMap((segment) => segment.split(/[,·;]/));
  const shortLines = bodyLines.filter((line) => line.length <= 90);

  const seen = new Set<string>();
  const phrases: string[] = [];
  for (const raw of [...pieces, ...shortLines]) {
    const phrase = cleanPhrase(raw);
    if (phrase.length < 4 || phrase.length > 90) continue;
    if (!titleLooksRelevant(phrase)) continue;
    const key = phrase.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    phrases.push(phrase);
  }
  return phrases;
}

/**
 * `board_token` is unused (one source covers the whole thread); "default"
 * is fine. posted_at is left null on purpose: the thread is posted once a
 * month and roles stay open for weeks, so a post's own date would make
 * classify.ts's 7-day freshness check drop almost everything after the
 * first week of the month. Never throws; degrades to [].
 */
export async function fetchHackerNewsJobs(_source: JobSource): Promise<NormalizedJob[]> {
  const jobs: NormalizedJob[] = [];

  for (const thread of await hiringThreads()) {
    const data = await getJson<{ hits: HnComment[] }>(
      `${ALGOLIA}/search?tags=comment,story_${thread.objectID}&hitsPerPage=1000`,
    );
    const posts = (data?.hits ?? []).filter((c) => String(c.parent_id) === thread.objectID);
    const month = thread.title.match(/\(([^)]+)\)/)?.[1] ?? "";

    for (const post of posts) {
      if (!post.comment_text) continue;
      const text = toText(post.comment_text);
      const [header = "", ...bodyLines] = text.split("\n").map((l) => l.trim()).filter(Boolean);

      const segments = header.split("|").map((s) => s.trim());
      const company = cleanPhrase(segments[0].replace(/\(.*?\)/g, "")).slice(0, 80);
      if (!company) continue;
      const location = segments.find((s, i) => i > 0 && LOCATION_PATTERN.test(s)) ?? null;

      rolePhrases(header, bodyLines).forEach((title, index) => {
        // A role line can carry its own location, e.g. "Growth Marketer
        // (Remote, Global)" - that beats the post-wide header value.
        const ownLocation = title.match(/\(([^)]*)\)/)?.[1];
        const locationText =
          ownLocation && LOCATION_PATTERN.test(ownLocation) ? ownLocation : location;

        jobs.push({
          ats: "hackernews",
          external_id: `${post.objectID}-${index}`,
          company_name: company,
          title,
          location_text: locationText,
          apply_url: `https://news.ycombinator.com/item?id=${post.objectID}`,
          description_text: `${text.slice(0, 6000)}\n\nPosted in Hacker News "Who is hiring?" (${month}).`,
          is_remote: locationText ? /remote|anywhere|worldwide|global/i.test(locationText) : null,
          posted_at: null,
        });
      });
    }
  }

  return jobs;
}
