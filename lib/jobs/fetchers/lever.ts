import type { JobSource, NormalizedJob } from "../types";

type LeverPosting = {
  id: string;
  text: string;
  hostedUrl: string;
  categories?: { location?: string };
  descriptionPlain?: string;
};

/** Lever's public per-company postings API. Returns an array directly (no wrapper object). Never throws; degrades to []. */
export async function fetchLeverJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      `https://api.lever.co/v0/postings/${source.board_token}?mode=json`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) {
      console.error(`Lever fetch failed for ${source.company_name}: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as LeverPosting[];
    if (!Array.isArray(data)) return [];

    return data.map((posting) => ({
      ats: "lever" as const,
      external_id: posting.id,
      company_name: source.company_name,
      title: posting.text,
      location_text: posting.categories?.location ?? null,
      apply_url: posting.hostedUrl,
      description_text: posting.descriptionPlain ?? null,
      is_remote: null, // Lever's public postings API has no structured remote flag
    }));
  } catch (error) {
    console.error(`Lever fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
