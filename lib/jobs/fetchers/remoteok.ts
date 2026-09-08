import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type RemoteOkJob = {
  id?: string;
  slug?: string;
  company?: string;
  position?: string;
  location?: string;
  apply_url?: string;
  url?: string;
  description?: string;
};

const MAX_JOBS = 300;

/**
 * RemoteOK's free public feed - remote jobs only, across thousands of
 * companies. Requires a real User-Agent header or it 403s. The first
 * element of the response array is always a legal-notice object, not a
 * job. Never throws; degrades to [].
 */
export async function fetchRemoteOkJobs(_source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch("https://remoteok.com/api", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; job-application-machine/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`RemoteOK fetch failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as unknown;
    const jobs = Array.isArray(data) ? (data.slice(1) as RemoteOkJob[]) : [];

    return jobs
      .filter((job) => job.id && job.position && job.company)
      .slice(0, MAX_JOBS)
      .map((job) => ({
        ats: "remoteok" as const,
        external_id: String(job.id),
        company_name: job.company ?? "Unknown",
        title: job.position ?? "",
        location_text: job.location || null,
        apply_url: job.apply_url ?? job.url ?? "",
        description_text: job.description ? stripHtml(job.description) : null,
        is_remote: true, // RemoteOK only lists remote jobs by definition
      }));
  } catch (error) {
    console.error("RemoteOK fetch errored:", error);
    return [];
  }
}
