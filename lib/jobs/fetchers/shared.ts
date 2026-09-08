/**
 * Strips HTML tags and collapses whitespace, for storing a plain-text job
 * description. Greenhouse's `content` field comes back HTML-entity-encoded
 * (e.g. `&lt;div&gt;` rather than a literal `<div>`), so entities are
 * decoded first, then tags are stripped from the now-literal markup.
 */
export function stripHtml(html: string): string {
  const decoded = html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

  return decoded
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** A fetch with a fixed timeout, throwing a plain Error on any network failure or non-2xx status. */
export async function fetchOrThrow(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res;
}

// A rough superset of classify.ts's growth/marketing keyword lists, used
// only as a cheap pre-filter so fetchers that need a second network call
// per posting (SmartRecruiters' detail endpoint, the custom scraper's job
// detail pages) don't fetch every single unrelated posting a company has
// open. The real track/eligibility decision still happens in classify.ts
// against the full description once this pre-filter lets a title through.
const TITLE_PREFILTER_KEYWORDS = [
  "growth",
  "marketing",
  "performance market",
  "paid acquisition",
  "paid social",
  "paid media",
  "content",
  "brand",
  "social media",
  "copywrit",
  "creative",
  "demand generation",
  "community",
];

export function titleLooksRelevant(title: string): boolean {
  const lower = title.toLowerCase();
  return TITLE_PREFILTER_KEYWORDS.some((keyword) => lower.includes(keyword));
}

/** Plain-text page content for the custom scraper's job detail pages: drops script/style/nav/header/footer, then collapses whitespace and truncates. */
export function extractPageText(html: string, maxLength = 6000): string {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<header[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ");

  const text = withoutNoise
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

  return text.slice(0, maxLength);
}

