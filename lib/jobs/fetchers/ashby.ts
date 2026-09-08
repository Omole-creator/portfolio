import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type AshbyJob = {
  id: string;
  title: string;
  location?: string;
  applyUrl?: string;
  jobUrl?: string;
  descriptionHtml?: string;
  isRemote?: boolean;
};

/** Ashby's public per-company job board API. Plain GET, no auth. Never throws; degrades to []. */
export async function fetchAshbyJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      `https://api.ashbyhq.com/posting-api/job-board/${source.board_token}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) {
      console.error(`Ashby fetch failed for ${source.company_name}: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { jobs?: AshbyJob[] };

    return (data.jobs ?? []).map((job) => ({
      ats: "ashby" as const,
      external_id: job.id,
      company_name: source.company_name,
      title: job.title,
      location_text: job.location ?? null,
      apply_url: job.applyUrl ?? job.jobUrl ?? "",
      description_text: job.descriptionHtml ? stripHtml(job.descriptionHtml) : null,
      is_remote: typeof job.isRemote === "boolean" ? job.isRemote : null,
    }));
  } catch (error) {
    console.error(`Ashby fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
