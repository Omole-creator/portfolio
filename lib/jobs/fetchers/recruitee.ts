import type { JobSource, NormalizedJob } from "../types";

type RecruiteeOffer = {
  id: number;
  title: string;
  location?: string;
  remote?: boolean;
  careers_apply_url?: string;
  careers_url?: string;
  description?: string;
};

/** Recruitee's public careers-site API. No auth needed. Never throws; degrades to []. */
export async function fetchRecruiteeJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(`https://${source.board_token}.recruitee.com/api/offers/`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Recruitee fetch failed for ${source.company_name}: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { offers?: RecruiteeOffer[] };

    return (data.offers ?? []).map((offer) => ({
      ats: "recruitee" as const,
      external_id: String(offer.id),
      company_name: source.company_name,
      title: offer.title,
      location_text: offer.location ?? null,
      apply_url: offer.careers_apply_url ?? offer.careers_url ?? "",
      description_text: offer.description
        ? offer.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
        : null,
      is_remote: typeof offer.remote === "boolean" ? offer.remote : null,
    }));
  } catch (error) {
    console.error(`Recruitee fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
