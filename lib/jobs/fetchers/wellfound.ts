import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

// Wellfound (formerly AngelList Talent) has no public API, but its public
// remote role pages (wellfound.com/role/r/<role>) are server-rendered by
// Next.js and carry every listing's full data in the page's __NEXT_DATA__
// JSON: title, full description, posting date, minimum years of
// experience, and the list of countries a remote role accepts (confirmed
// live 2026-09-25 with a plain fetch, no browser needed). An empty
// acceptedRemoteLocationNames on a remote listing is what Wellfound's own
// job page renders as "Hires remotely in Everywhere" (confirmed live on a
// real listing), so that's mapped to an explicit worldwide location below.
//
// Applying on Wellfound needs a Wellfound account. That breaks the usual
// "no account sign-up" rule for job sources on purpose: Omole named
// Wellfound and Work at a Startup as the only two exceptions.
type WellfoundListing = {
  __typename: "JobListingSearchResult";
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  remote?: boolean | null;
  locationNames?: string[] | null;
  acceptedRemoteLocationNames?: string[] | null;
  liveStartAt?: number | null;
  yearsExperienceMin?: number | null;
  compensation?: string | null;
};

type WellfoundStartup = {
  __typename: "StartupResult";
  name: string;
  highlightedJobListings?: { __ref: string }[];
};

// Wellfound role slugs that exist as remote role pages (each confirmed to
// return 200 live; guessed slugs that don't exist 303-redirect to /remote).
// Broad on purpose - classify.ts's title keywords decide what actually fits.
const DEFAULT_ROLES = [
  "marketing",
  "marketing-manager",
  "product-marketing-manager",
  "growth-hacker",
  "digital-marketing-manager",
  "social-media-manager",
  "content-manager",
  "copywriter",
  "web-designer",
];

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  Accept: "text/html",
};

async function fetchRolePage(role: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`https://wellfound.com/role/r/${encodeURIComponent(role)}`, {
      headers: HEADERS,
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`Wellfound role "${role}" fetch failed: ${res.status}`);
      return null;
    }
    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) return null;
    const data = JSON.parse(match[1]);
    return data?.props?.pageProps?.apolloState?.data ?? null;
  } catch (err) {
    console.error(`Wellfound role "${role}" fetch failed:`, err);
    return null;
  }
}

function locationFor(listing: WellfoundListing): string {
  const accepted = listing.acceptedRemoteLocationNames ?? [];
  if (!accepted.length) return "Remote, Worldwide";
  return `Remote (${accepted.join("; ")})`;
}

/**
 * Wellfound's remote role pages. `board_token` is an optional
 * comma-separated list of role slugs (e.g. "marketing,copywriter");
 * "default" (or empty) uses DEFAULT_ROLES. Only remote listings are kept. Never throws;
 * degrades to [].
 */
export async function fetchWellfoundJobs(source: JobSource): Promise<NormalizedJob[]> {
  const token = source.board_token.trim();
  const roles =
    token && token.toLowerCase() !== "default"
      ? token.split(",").map((r) => r.trim()).filter(Boolean)
      : DEFAULT_ROLES;

  const listings = new Map<string, { listing: WellfoundListing; company: string }>();

  for (const role of roles) {
    const state = await fetchRolePage(role);
    if (!state) continue;

    const companyByListing = new Map<string, string>();
    for (const value of Object.values(state)) {
      const startup = value as WellfoundStartup;
      if (startup?.__typename !== "StartupResult") continue;
      for (const ref of startup.highlightedJobListings ?? []) {
        companyByListing.set(ref.__ref, startup.name);
      }
    }

    for (const [key, value] of Object.entries(state)) {
      const listing = value as WellfoundListing;
      if (listing?.__typename !== "JobListingSearchResult") continue;
      if (listing.remote !== true || listings.has(listing.id)) continue;
      listings.set(listing.id, { listing, company: companyByListing.get(key) ?? "Unknown company" });
    }
  }

  return [...listings.values()].map(({ listing, company }) => {
    const description = [
      listing.description ? stripHtml(listing.description) : "",
      // Wellfound stores minimum experience as a structured field that
      // often isn't repeated in the prose, so it's appended in the exact
      // "N years of experience" shape classify.ts's experience check reads.
      listing.yearsExperienceMin ? `Requires ${listing.yearsExperienceMin} years of experience.` : "",
      listing.compensation ? `Compensation: ${listing.compensation}.` : "",
    ]
      .filter(Boolean)
      .join(" ");

    return {
      ats: "wellfound" as const,
      external_id: listing.id,
      company_name: company,
      title: listing.title.trim(),
      location_text: locationFor(listing),
      apply_url: `https://wellfound.com/jobs/${listing.id}-${listing.slug}`,
      description_text: description || null,
      is_remote: true,
      posted_at: listing.liveStartAt ? new Date(listing.liveStartAt * 1000).toISOString() : null,
    };
  });
}
