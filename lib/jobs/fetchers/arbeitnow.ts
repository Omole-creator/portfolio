import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type ArbeitnowJob = {
  slug: string;
  company_name: string;
  title: string;
  description?: string;
  remote?: boolean;
  url: string;
  location?: string;
  created_at?: number;
};

/**
 * Arbeitnow's free public job board API - unlike the other three
 * aggregators, this one is NOT remote-only, so `is_remote` is mapped
 * straight from its own `remote` flag and classify.ts's remote gate does
 * the actual filtering. No category/tag filter is supported by this API,
 * so `board_token` is unused here. Never throws; degrades to [].
 */
export async function fetchArbeitnowJobs(_source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch("https://www.arbeitnow.com/api/job-board-api", {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Arbeitnow fetch failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { data?: ArbeitnowJob[] };

    return (data.data ?? []).map((job) => ({
      ats: "arbeitnow" as const,
      external_id: job.slug,
      company_name: job.company_name,
      title: job.title,
      location_text: job.location || null,
      apply_url: job.url,
      description_text: job.description ? stripHtml(job.description) : null,
      is_remote: typeof job.remote === "boolean" ? job.remote : null,
      posted_at:
        typeof job.created_at === "number" ? new Date(job.created_at * 1000).toISOString() : null,
    }));
  } catch (error) {
    console.error("Arbeitnow fetch errored:", error);
    return [];
  }
}
