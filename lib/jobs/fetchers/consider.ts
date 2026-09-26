import type { JobSource, NormalizedJob } from "../types";
import { SENIOR_TITLE_PATTERN } from "../classify";
import { fetchApplyPageText, titleLooksRelevant } from "./shared";

// Consider powers another family of VC portfolio job boards
// (jobs.sequoiacap.com, jobs.lsvp.com, jobs.bvp.com, jobs.gv.com, ...),
// the same Wellfound-like "roles at startups this firm funded" idea as
// Getro. Its board page is client-rendered, but the page itself calls a
// JSON endpoint, POST /api-boards/search-jobs, that works with a plain
// fetch once it has the session cookie and csrfToken the board page hands
// out (confirmed live 2026-09-26; without them it answers INVALID_CSRF).
// The board id that endpoint needs is read off the same page, so a source
// only has to store the host. Each listing's applyUrl is the employer's own
// apply page, so no account is needed.
//
// Listings carry no description, so the employer's apply page is fetched
// for each remote, relevant, non-senior title, as in getro.ts.
type ConsiderJob = {
  jobId: string;
  companySlug: string;
  companyName: string;
  companyStaffCount: number | null;
  title: string;
  applyUrl: string | null;
  url: string;
  locations: string[] | null;
  remote: boolean;
  minYearsExp: number | null;
  timeStamp: string | null;
};

// Consider reports an actual headcount. Above this, the company is past the
// "no big companies" line the rest of the sources follow (confirmed live:
// these boards mix seed startups with 3,000-person portfolio companies).
// Unknown size is kept.
const MAX_STAFF = 200;
const PAGE_SIZE = 100;
const MAX_PAGES = 3;
const MAX_DETAIL_FETCHES = 15;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

type Session = { cookie: string; csrf: string; boardId: string };

async function openSession(host: string): Promise<Session | null> {
  try {
    const res = await fetch(`https://${host}/jobs`, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      console.error(`Consider ${host} board page failed: ${res.status}`);
      return null;
    }
    const html = await res.text();
    const csrf = html.match(/csrfToken":"([^"]+)"/)?.[1];
    const boardId = html.match(/boards\/social\/([a-z0-9-]+)/)?.[1];
    const cookie = res.headers
      .getSetCookie()
      .map((c) => c.split(";")[0])
      .join("; ");
    if (!csrf || !boardId || !cookie) {
      console.error(
        `Consider ${host}: no csrf token, board id, or session cookie on the page`,
      );
      return null;
    }
    return { cookie, csrf, boardId };
  } catch (err) {
    console.error(`Consider ${host} board page failed:`, err);
    return null;
  }
}

async function searchJobs(
  host: string,
  session: Session,
): Promise<ConsiderJob[]> {
  const jobs: ConsiderJob[] = [];
  let sequence: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    try {
      const res = await fetch(`https://${host}/api-boards/search-jobs`, {
        method: "POST",
        headers: {
          "User-Agent": UA,
          "Content-Type": "application/json",
          Cookie: session.cookie,
          "x-csrf-token": session.csrf,
        },
        body: JSON.stringify({
          meta: { size: PAGE_SIZE, ...(sequence ? { sequence } : {}) },
          board: { id: session.boardId, isParent: true },
          // "Marketing" is Consider's own job-function tag; confirmed live
          // it narrows Sequoia's 2,412 remote roles to 247.
          query: { remoteOnly: true, jobFunctions: ["Marketing"] },
          grouped: false,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.error(`Consider ${host} search failed: ${res.status}`);
        break;
      }
      const data = await res.json();
      const batch: ConsiderJob[] = data?.jobs ?? [];
      jobs.push(...batch);
      sequence = data?.meta?.sequence;
      if (batch.length < PAGE_SIZE || !sequence) break;
    } catch (err) {
      console.error(`Consider ${host} search failed:`, err);
      break;
    }
  }
  return jobs;
}

/**
 * A Consider-hosted VC portfolio board. `board_token` is the board's host
 * (e.g. "jobs.sequoiacap.com"). Never throws; degrades to [].
 */
export async function fetchConsiderJobs(
  source: JobSource,
): Promise<NormalizedJob[]> {
  const host = source.board_token
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
  const session = await openSession(host);
  if (!session) return [];

  const candidates = (await searchJobs(host, session)).filter(
    (job) =>
      job.remote &&
      titleLooksRelevant(job.title) &&
      !SENIOR_TITLE_PATTERN.test(job.title) &&
      (job.companyStaffCount == null || job.companyStaffCount <= MAX_STAFF),
  );

  return Promise.all(
    candidates
      .slice(0, MAX_DETAIL_FETCHES)
      .map(async (job): Promise<NormalizedJob> => {
        const applyUrl = job.applyUrl || job.url;
        const locations = (job.locations ?? []).filter(Boolean);
        const pageText = await fetchApplyPageText(applyUrl);
        const description = [
          pageText,
          // Consider stores minimum experience as a structured field; it's
          // appended in the "N years of experience" shape classify.ts reads.
          job.minYearsExp
            ? `Requires ${job.minYearsExp} years of experience.`
            : "",
        ]
          .filter(Boolean)
          .join(" ");

        return {
          ats: "consider",
          // Portfolio companies show up on several VCs' boards; company slug +
          // the ATS job id is the same across all of them, so they dedupe.
          external_id: `${job.companySlug}-${job.jobId}`,
          company_name: job.companyName,
          title: job.title.trim(),
          location_text: locations.length ? locations.join("; ") : "Remote",
          apply_url: applyUrl,
          description_text: description || null,
          is_remote: true,
          posted_at: job.timeStamp
            ? new Date(job.timeStamp).toISOString()
            : null,
        };
      }),
  );
}
