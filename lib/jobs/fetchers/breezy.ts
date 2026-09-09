import type { JobSource, NormalizedJob } from "../types";

// Unlike the other fetchers in this folder, this one's exact field shape
// wasn't confirmed against a populated real posting (every company account
// tried during development had zero current openings, only an empty `[]`
// response, which did confirm the endpoint and array shape). Field names
// below are best-effort from Breezy's own documentation and may need a
// small correction the first time a real posting comes through - check
// console output after the first sync against a source using this ATS.
type BreezyJob = {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  friendly_id?: string;
  url?: string;
  location?: {
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    is_remote?: boolean;
  };
  description?: string;
  published_date?: string;
  creation_date?: string;
};

/** Breezy HR's public careers-portal JSON feed. Never throws; degrades to []. */
export async function fetchBreezyJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(`https://${source.board_token}.breezy.hr/json`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Breezy fetch failed for ${source.company_name}: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as BreezyJob[];
    if (!Array.isArray(data)) return [];

    return data.map((job) => {
      const title = job.name ?? job.title ?? "";
      const locationText =
        job.location?.name ??
        [job.location?.city, job.location?.state, job.location?.country].filter(Boolean).join(", ") ??
        null;

      return {
        ats: "breezy" as const,
        external_id: job.id ?? job._id ?? job.friendly_id ?? title,
        company_name: source.company_name,
        title,
        location_text: locationText || null,
        apply_url: job.url ?? "",
        description_text: job.description
          ? job.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
          : null,
        is_remote: typeof job.location?.is_remote === "boolean" ? job.location.is_remote : null,
        posted_at: job.published_date ?? job.creation_date ?? null,
      };
    });
  } catch (error) {
    console.error(`Breezy fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
