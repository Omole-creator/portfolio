import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type JobicyJob = {
  id: number;
  url: string;
  jobTitle: string;
  companyName: string;
  jobGeo?: string;
  jobDescription?: string;
  pubDate?: string;
};

/**
 * Jobicy's free public feed - remote jobs only, across many companies.
 * `board_token` on the source is used as the `tag` query param (e.g.
 * "marketing"). `jobGeo` (e.g. "EMEA, LATAM, Canada, USA") is a real
 * eligibility signal - fed into location_text so classify.ts's exclusion/
 * worldwide checks see it. Never throws; degrades to [].
 */
export async function fetchJobicyJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const tag = encodeURIComponent(source.board_token || "marketing");
    const res = await fetch(`https://jobicy.com/api/v2/remote-jobs?count=100&tag=${tag}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Jobicy fetch failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { jobs?: JobicyJob[] };

    return (data.jobs ?? []).map((job) => ({
      ats: "jobicy" as const,
      external_id: String(job.id),
      company_name: job.companyName,
      title: job.jobTitle,
      location_text: job.jobGeo || null,
      apply_url: job.url,
      description_text: job.jobDescription ? stripHtml(job.jobDescription) : null,
      is_remote: true, // Jobicy only lists remote jobs by definition
      posted_at: job.pubDate ?? null,
    }));
  } catch (error) {
    console.error("Jobicy fetch errored:", error);
    return [];
  }
}
