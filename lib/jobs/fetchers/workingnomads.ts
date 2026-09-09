import type { JobSource, NormalizedJob } from "../types";
import { stripHtml } from "./shared";

type WorkingNomadsJob = {
  url: string;
  title: string;
  description?: string;
  company_name: string;
  location?: string;
  pub_date?: string;
};

// Working Nomads' `url` field is a redirect through workingnomads.com/job/go/
// - unlike RemoteOK/Remotive/Arbeitnow, this is a genuine pass-through to the
// real employer's own application page (confirmed live: a sample of postings
// resolved to apply.workable.com, career.proxify.io, etc., not a Working
// Nomads-hosted page). That's structurally the cleanest kind of aggregator
// for the "must not require account sign-up" rule - but the destination
// varies per posting (it's whatever ATS or system that specific employer
// uses), and some employers' own systems do require creating an account
// (confirmed live: one posting redirected straight to
// "markervideo.com/api/auth/signup"). SIGNUP_URL_PATTERN filters those out
// by checking the resolved destination URL itself, since that's cheap and
// reliable compared to fetching and parsing every destination page's HTML
// the way extractQuestions.ts does for the primary apply flow.
const SIGNUP_URL_PATTERN = /\/(sign[-_]?up|register|create[-_]?account)\b/i;

const MAX_JOBS = 60;
const REDIRECT_TIMEOUT_MS = 8000;

async function resolveRealApplyUrl(goUrl: string): Promise<string | null> {
  try {
    const res = await fetch(goUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; job-application-machine/1.0)" },
      redirect: "follow",
      signal: AbortSignal.timeout(REDIRECT_TIMEOUT_MS),
    });
    // res.url is already the final destination once redirect: "follow" has
    // run, regardless of that destination's own status code - a real
    // browser opening the same link works fine even when the landing page
    // 403s a plain server-side fetch (confirmed live: career.proxify.io
    // does this, presumably bot-protection against the request headers,
    // not an actual dead link). Only a genuine network failure (caught
    // below) should discard the job.
    return res.url || null;
  } catch {
    return null;
  }
}

/**
 * Working Nomads' free public feed. The `category` query param was tested
 * live and found to not narrow results at all (same as Remotive/Jobicy), so
 * `board_token` is unused here - one "all jobs" source, same as RemoteOK/
 * Arbeitnow. Each job needs its own redirect-resolving request to find the
 * real apply URL and check it for a signup requirement, so this is capped
 * lower than the other aggregators to keep sync time bounded. Never throws;
 * degrades to [].
 */
export async function fetchWorkingNomadsJobs(_source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch("https://www.workingnomads.com/api/exposed_jobs/", {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; job-application-machine/1.0)" },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) {
      console.error(`Working Nomads fetch failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as WorkingNomadsJob[];
    if (!Array.isArray(data)) return [];

    const jobs: NormalizedJob[] = [];

    for (const job of data.slice(0, MAX_JOBS)) {
      if (!job.url || !job.title || !job.company_name) continue;

      const realUrl = await resolveRealApplyUrl(job.url);
      if (!realUrl || SIGNUP_URL_PATTERN.test(realUrl)) continue;

      jobs.push({
        ats: "workingnomads",
        external_id: job.url,
        company_name: job.company_name,
        title: job.title,
        location_text: job.location || null,
        apply_url: realUrl,
        description_text: job.description ? stripHtml(job.description) : null,
        is_remote: true, // Working Nomads only lists remote jobs by definition
        posted_at: job.pub_date ?? null,
      });
    }

    return jobs;
  } catch (error) {
    console.error("Working Nomads fetch errored:", error);
    return [];
  }
}
