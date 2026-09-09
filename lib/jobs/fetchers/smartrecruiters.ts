import type { JobSource, NormalizedJob } from "../types";
import { titleLooksRelevant } from "./shared";

type SmartRecruitersListItem = {
  id: string;
  name: string;
  location?: { city?: string; region?: string; country?: string; remote?: boolean };
};

type SmartRecruitersDetail = {
  postingUrl?: string;
  jobAd?: { sections?: Record<string, { text?: string }> };
  // Not confirmed against a real posting - documented by SmartRecruiters as
  // the posting's release date. Best-effort; correct if it comes back
  // empty on a real synced posting.
  releasedDate?: string;
};

/**
 * SmartRecruiters' public API. The list endpoint has no description or
 * public apply URL - both only come from a per-posting detail call, so
 * this pre-filters by title (titleLooksRelevant) before paying for that
 * second request, and caps the number of detail calls per sync so a
 * company with a huge board can't blow out the sync's run time.
 */
const MAX_DETAIL_FETCHES = 25;

export async function fetchSmartRecruitersJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const listRes = await fetch(
      `https://api.smartrecruiters.com/v1/companies/${source.board_token}/postings`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!listRes.ok) {
      console.error(`SmartRecruiters fetch failed for ${source.company_name}: ${listRes.status}`);
      return [];
    }

    const list = (await listRes.json()) as { content?: SmartRecruitersListItem[] };
    const candidates = (list.content ?? [])
      .filter((item) => titleLooksRelevant(item.name))
      .slice(0, MAX_DETAIL_FETCHES);

    const jobs: NormalizedJob[] = [];

    for (const item of candidates) {
      try {
        const detailRes = await fetch(
          `https://api.smartrecruiters.com/v1/companies/${source.board_token}/postings/${item.id}`,
          { signal: AbortSignal.timeout(10000) },
        );
        if (!detailRes.ok) continue;

        const detail = (await detailRes.json()) as SmartRecruitersDetail;
        const description = detail.jobAd?.sections?.jobDescription?.text ?? null;

        jobs.push({
          ats: "smartrecruiters",
          external_id: item.id,
          company_name: source.company_name,
          title: item.name,
          location_text: item.location
            ? [item.location.city, item.location.region, item.location.country]
                .filter(Boolean)
                .join(", ") || null
            : null,
          apply_url: detail.postingUrl ?? "",
          description_text: description ? description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : null,
          is_remote: item.location?.remote ?? null,
          posted_at: detail.releasedDate ?? null,
        });
      } catch (error) {
        console.error(`SmartRecruiters detail fetch failed for ${source.company_name} / ${item.id}:`, error);
      }
    }

    return jobs;
  } catch (error) {
    console.error(`SmartRecruiters fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
