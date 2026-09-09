import * as cheerio from "cheerio";
import type { JobSource, NormalizedJob } from "../types";
import { extractPageText, titleLooksRelevant } from "./shared";

const NAV_TEXT_BLOCKLIST = new Set([
  "home",
  "about",
  "about us",
  "contact",
  "contact us",
  "blog",
  "careers",
  "jobs",
  "privacy",
  "privacy policy",
  "terms",
  "terms of service",
  "login",
  "sign in",
  "sign up",
  "log in",
  "press",
  "news",
  "faq",
  "help",
  "support",
  "pricing",
  "products",
  "company",
  "team",
  "our team",
  "investors",
  "media kit",
  "cookie policy",
  "sitemap",
  "back to jobs",
  "all jobs",
  "view all",
  "learn more",
  "read more",
  "apply now",
  "see all openings",
]);

const MAX_CANDIDATES = 15;

function isLikelyJobLink(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 4 || trimmed.length > 140) return false;
  return !NAV_TEXT_BLOCKLIST.has(trimmed.toLowerCase());
}

/**
 * Best-effort scraper for a company's own bespoke careers page - the
 * fallback for when a company doesn't use any of the recognized ATS
 * platforms elsewhere in this folder. `source.board_token` holds the full
 * careers page URL for this ats.
 *
 * Much noisier than the structured fetchers: it guesses at job links by
 * text heuristics (filtered through the same title-keyword pre-check used
 * elsewhere), then fetches each candidate's own page for plain-text
 * content, since a generic page has no structured location/remote field -
 * classify.ts falls back to scanning that description text for "remote"
 * and eligibility signals. Expect more false positives and false negatives
 * here than from any of the real ATS integrations. Never throws; degrades
 * to [].
 */
export async function fetchCustomJobs(source: JobSource): Promise<NormalizedJob[]> {
  const careersUrl = source.board_token;

  try {
    const listRes = await fetch(careersUrl, { signal: AbortSignal.timeout(10000) });
    if (!listRes.ok) {
      console.error(`Custom fetch failed for ${source.company_name}: ${listRes.status}`);
      return [];
    }

    const html = await listRes.text();
    const $ = cheerio.load(html);

    const seen = new Set<string>();
    const candidates: { title: string; href: string }[] = [];

    $("a").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      const href = $(el).attr("href");
      if (!href || !isLikelyJobLink(text) || !titleLooksRelevant(text)) return;

      let absolute: string;
      try {
        absolute = new URL(href, careersUrl).toString();
      } catch {
        return;
      }
      if (seen.has(absolute)) return;
      seen.add(absolute);
      candidates.push({ title: text, href: absolute });
    });

    const jobs: NormalizedJob[] = [];

    for (const candidate of candidates.slice(0, MAX_CANDIDATES)) {
      try {
        const detailRes = await fetch(candidate.href, { signal: AbortSignal.timeout(10000) });
        if (!detailRes.ok) continue;
        const detailHtml = await detailRes.text();

        jobs.push({
          ats: "custom",
          external_id: candidate.href,
          company_name: source.company_name,
          title: candidate.title,
          location_text: null,
          apply_url: candidate.href,
          description_text: extractPageText(detailHtml),
          is_remote: null,
          posted_at: null, // a generic scraped page has no structured date field
        });
      } catch (error) {
        console.error(
          `Custom detail fetch failed for ${source.company_name} / ${candidate.href}:`,
          error,
        );
      }
    }

    return jobs;
  } catch (error) {
    console.error(`Custom fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
