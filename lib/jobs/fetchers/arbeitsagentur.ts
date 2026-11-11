import type { JobSource, NormalizedJob } from "../types";
import { titleLooksRelevant } from "./shared";

// The Bundesagentur fuer Arbeit's Jobboerse, Germany's official job
// database. Make it in Germany's job listings and JobMESH both read from
// this same database, so this one source covers all three (their own pages
// render client-side and can't be read with a plain fetch).
//
// Uses the public API documented at jobsuche.api.bund.dev, with its
// published key. Confirmed live on 2026-11-11: the search lives at
// pc/v6/jobs (v4/v5 search returns 403), but the detail endpoint only
// answers at pc/v4/jobdetails/<base64 refnr>. The search result has no
// description, so relevant titles get a second call for the full text,
// which classify.ts needs to find visa/relocation wording.
const API = "https://rest.arbeitsagentur.de/jobboerse/jobsuche-service";
const HEADERS = { "X-API-Key": "jobboerse-jobsuche" };

const DEFAULT_QUERIES = [
  "Marketing Manager",
  "Online Marketing",
  "Growth Marketing",
  "Content Marketing",
  "Social Media Manager",
  "Performance Marketing",
  "Copywriter",
  "Webdesigner",
];

const MAX_DETAILS = 25;

type BaListing = {
  referenznummer?: string;
  refnr?: string;
  stellenangebotsTitel?: string;
  titel?: string;
  firma?: string;
  externeURL?: string;
  datumErsteVeroeffentlichung?: string;
  stellenlokationen?: { adresse?: { ort?: string } }[];
};

type BaDetail = { stellenangebotsBeschreibung?: string };

function refOf(job: BaListing): string | null {
  return job.referenznummer ?? job.refnr ?? null;
}

async function search(query: string): Promise<BaListing[]> {
  const params = new URLSearchParams({
    was: query,
    size: "50",
    angebotsart: "1",
    veroeffentlichtseit: "7",
  });
  try {
    const res = await fetch(`${API}/pc/v6/jobs?${params}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`Arbeitsagentur search "${query}" failed: ${res.status}`);
      return [];
    }
    const data = (await res.json()) as { ergebnisliste?: BaListing[] };
    return data.ergebnisliste ?? [];
  } catch (error) {
    console.error(`Arbeitsagentur search "${query}" errored:`, error);
    return [];
  }
}

async function fetchDescription(ref: string): Promise<string | null> {
  try {
    const id = Buffer.from(ref).toString("base64");
    const res = await fetch(`${API}/pc/v4/jobdetails/${id}`, {
      headers: HEADERS,
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as BaDetail;
    return data.stellenangebotsBeschreibung?.replace(/\s+/g, " ").trim() || null;
  } catch {
    return null;
  }
}

/** Searches the Jobboerse for growth/marketing/web titles posted in the last week. Never throws; degrades to []. */
export async function fetchArbeitsagenturJobs(source: JobSource): Promise<NormalizedJob[]> {
  const token = source.board_token.trim();
  const queries =
    !token || token === "default"
      ? DEFAULT_QUERIES
      : token.split(",").map((q) => q.trim()).filter(Boolean);

  const results = await Promise.all(queries.map(search));

  const seen = new Set<string>();
  const relevant: (BaListing & { ref: string })[] = [];
  for (const job of results.flat()) {
    const ref = refOf(job);
    const title = job.stellenangebotsTitel ?? job.titel ?? "";
    if (!ref || seen.has(ref) || !titleLooksRelevant(title)) continue;
    seen.add(ref);
    relevant.push({ ...job, ref });
  }

  const picked = relevant.slice(0, MAX_DETAILS);
  const descriptions = await Promise.all(picked.map((job) => fetchDescription(job.ref)));

  return picked.map((job, i) => {
    const city = job.stellenlokationen?.[0]?.adresse?.ort;
    return {
      ats: "arbeitsagentur" as const,
      external_id: job.ref,
      company_name: job.firma ?? "Unknown company",
      title: job.stellenangebotsTitel ?? job.titel ?? "",
      location_text: city ? `${city}, Germany` : "Germany",
      apply_url:
        job.externeURL ||
        `https://www.arbeitsagentur.de/jobsuche/jobdetail/${encodeURIComponent(job.ref)}`,
      description_text: descriptions[i],
      // Onsite unless the ad itself says remote; classify.ts's relocation
      // path decides whether an onsite German role is kept.
      is_remote: false,
      posted_at: job.datumErsteVeroeffentlichung
        ? new Date(`${job.datumErsteVeroeffentlichung}T00:00:00Z`).toISOString()
        : null,
    };
  });
}
