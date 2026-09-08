import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type RemotiveJob = {
  id: number;
  url: string;
  title: string;
  company_name: string;
  candidate_required_location?: string;
  description?: string;
};

/**
 * Remotive's free public feed - remote jobs only, across many companies.
 * `board_token` on the source is used as the `category` query param (e.g.
 * "marketing") since there's no single company to scope to. Never throws;
 * degrades to [].
 */
export async function fetchRemotiveJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const category = encodeURIComponent(source.board_token || "marketing");
    const res = await fetch(`https://remotive.com/api/remote-jobs?category=${category}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Remotive fetch failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { jobs?: RemotiveJob[] };

    return (data.jobs ?? []).map((job) => ({
      ats: "remotive" as const,
      external_id: String(job.id),
      company_name: job.company_name,
      title: job.title,
      location_text: job.candidate_required_location || null,
      apply_url: job.url,
      description_text: job.description ? stripHtml(job.description) : null,
      is_remote: true, // Remotive only lists remote jobs by definition
    }));
  } catch (error) {
    console.error("Remotive fetch errored:", error);
    return [];
  }
}
