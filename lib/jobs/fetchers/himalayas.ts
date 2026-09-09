import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type HimalayasJob = {
  guid: string;
  title: string;
  companyName: string;
  locationRestrictions?: string[];
  description?: string;
  applicationLink?: string;
  pubDate?: number;
};

const MAX_JOBS = 100;

/**
 * Himalayas' free public jobs search API - genuinely keyword-filtered
 * (unlike Remotive/Jobicy's category params, which were tested live and
 * found to not narrow results at all). `board_token` on the source is the
 * search query (e.g. "growth marketing"). `locationRestrictions` is a real
 * structured field (array of countries a candidate must be based in) - fed
 * into location_text so classify.ts's exclusion check reads it the same
 * way as any other scoped location. Never throws; degrades to [].
 */
export async function fetchHimalayasJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const query = encodeURIComponent(source.board_token || "growth marketing");
    const res = await fetch(`https://himalayas.app/jobs/api/search?q=${query}&limit=${MAX_JOBS}`, {
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Himalayas fetch failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { jobs?: HimalayasJob[] };

    return (data.jobs ?? []).map((job) => ({
      ats: "himalayas" as const,
      external_id: job.guid,
      company_name: job.companyName,
      title: job.title,
      location_text: job.locationRestrictions?.length ? job.locationRestrictions.join(", ") : null,
      apply_url: job.applicationLink ?? "",
      description_text: job.description ? stripHtml(job.description) : null,
      is_remote: true, // Himalayas only lists remote jobs by definition
      posted_at: typeof job.pubDate === "number" ? new Date(job.pubDate * 1000).toISOString() : null,
    }));
  } catch (error) {
    console.error("Himalayas fetch errored:", error);
    return [];
  }
}
