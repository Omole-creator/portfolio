import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type GreenhouseJob = {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name?: string };
  content?: string;
};

/** Greenhouse's public per-company job board API. Never throws; degrades to []. */
export async function fetchGreenhouseJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      `https://boards-api.greenhouse.io/v1/boards/${source.board_token}/jobs?content=true`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) {
      console.error(`Greenhouse fetch failed for ${source.company_name}: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { jobs?: GreenhouseJob[] };

    return (data.jobs ?? []).map((job) => ({
      ats: "greenhouse" as const,
      external_id: String(job.id),
      company_name: source.company_name,
      title: job.title,
      location_text: job.location?.name ?? null,
      apply_url: job.absolute_url,
      description_text: job.content ? stripHtml(job.content) : null,
      is_remote: null, // Greenhouse's public API has no structured remote flag
    }));
  } catch (error) {
    console.error(`Greenhouse fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
