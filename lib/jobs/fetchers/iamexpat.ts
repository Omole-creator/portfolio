import type { JobSource, NormalizedJob } from "../types";
import { extractPageText, titleLooksRelevant } from "./shared";

// IamExpat Jobs Germany (iamexpat.de/career/jobs-germany), a job board for
// internationals. No API. Checked live 2026-11-11: each category page
// (e.g. /career/jobs-germany/marketing-pr-positions) links its latest jobs
// as /career/jobs-germany/<category>/<title-slug>/<id>, and each job page
// embeds a schema.org JobPosting (escaped inside the page's data payload)
// with datePosted, hiringOrganization and jobLocation, plus an "Apply for
// this position" link to the employer's own application page.
//
// These pages are large (2+ MB each), so the title slug is pre-filtered
// before any job page is fetched, and the number fetched is capped.
const BASE = "https://www.iamexpat.de";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Accept: "text/html",
};

const DEFAULT_CATEGORIES = ["marketing-pr-positions", "marketing-positions", "creative-design-positions"];
const MAX_DETAILS = 12;

/** Reads a field from the escaped JSON-LD (`\"datePosted\":\"...\"`) or a plain one. */
function jsonField(html: string, pattern: string): string | null {
  const re = new RegExp(`${pattern}\\\\?"\\s*:\\s*\\\\?"([^"\\\\]+)`);
  return html.match(re)?.[1] ?? null;
}

function decode(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&#x26;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

async function listCategory(category: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/career/jobs-germany/${encodeURIComponent(category)}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.error(`IamExpat ${category} failed: ${res.status}`);
      return [];
    }
    const html = await res.text();
    const paths = html.match(/\/career\/jobs-germany\/[a-z-]+-positions\/[^"/?#]+\/[A-Za-z0-9]+(?=")/g) ?? [];
    return [...new Set(paths)];
  } catch (error) {
    console.error(`IamExpat ${category} errored:`, error);
    return [];
  }
}

async function fetchJob(path: string): Promise<NormalizedJob | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
    if (!res.ok) return null;
    const html = await res.text();

    const title = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, "") ?? "");
    if (!title) return null;

    const orgName = html.match(/hiringOrganization\\?"\s*:\s*\{[^}]*?\\?"name\\?"\s*:\s*\\?"([^"\\]+)/)?.[1];
    const city = jsonField(html, "addressLocality");
    const datePosted = jsonField(html, "datePosted");
    const applyUrl =
      html.match(/href="(https?:\/\/[^"]+)"[^>]*>(?:\s*<[^>]+>)*\s*Apply for this position/)?.[1] ?? null;

    // Start the description at the role itself, past the site's menus.
    const text = extractPageText(html, 400000);
    const start = text.indexOf("About this role");
    const description = (start >= 0 ? text.slice(start) : text).slice(0, 8000);

    const id = path.split("/").pop() ?? path;
    const posted = datePosted ? new Date(datePosted) : null;

    return {
      ats: "iamexpat",
      external_id: id,
      company_name: decode(orgName ?? "Unknown company"),
      title,
      location_text: city ? `${decode(city)}, Germany` : "Germany",
      apply_url: applyUrl ? decode(applyUrl) : `${BASE}${path}`,
      description_text: description || null,
      is_remote: null,
      posted_at: posted && !Number.isNaN(posted.getTime()) ? posted.toISOString() : null,
    };
  } catch {
    return null;
  }
}

/** Never throws; degrades to []. board_token is "default" or a comma-separated list of category slugs. */
export async function fetchIamExpatJobs(source: JobSource): Promise<NormalizedJob[]> {
  const token = source.board_token.trim();
  const categories =
    !token || token === "default"
      ? DEFAULT_CATEGORIES
      : token.split(",").map((c) => c.trim()).filter(Boolean);

  const paths = [...new Set((await Promise.all(categories.map(listCategory))).flat())];
  const relevant = paths.filter((path) => {
    const slug = path.split("/").slice(-2, -1)[0] ?? "";
    return titleLooksRelevant(slug.replace(/-/g, " "));
  });

  const jobs = await Promise.all(relevant.slice(0, MAX_DETAILS).map(fetchJob));
  return jobs.filter((job): job is NormalizedJob => job !== null);
}
