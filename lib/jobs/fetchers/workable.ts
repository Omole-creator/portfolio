import type { JobSource, NormalizedJob } from "../types";

type WorkableJob = {
  shortcode?: string;
  id?: string;
  title: string;
  shortlink?: string;
  url?: string;
  location?: {
    location_str?: string;
    city?: string;
    country_name?: string;
    telecommuting?: boolean;
    workplace_type?: string;
  };
  full_description?: string;
  description?: string;
  // Not confirmed against a real posting (every account tried during
  // development had zero open jobs) - both names are documented by
  // Workable for different widget response shapes. Best-effort, same as
  // Breezy below; correct this the first time a real posting comes through
  // with neither field populated.
  published_on?: string;
  created_at?: string;
};

/** Workable's public widget API. `details=true` returns full_description in the same call, no second fetch needed. Never throws; degrades to []. */
export async function fetchWorkableJobs(source: JobSource): Promise<NormalizedJob[]> {
  try {
    const res = await fetch(
      `https://apply.workable.com/api/v1/widget/accounts/${source.board_token}?details=true`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!res.ok) {
      console.error(`Workable fetch failed for ${source.company_name}: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { jobs?: WorkableJob[] };

    return (data.jobs ?? []).map((job) => {
      const description = job.full_description ?? job.description ?? null;
      const locationText =
        job.location?.location_str ??
        [job.location?.city, job.location?.country_name].filter(Boolean).join(", ") ??
        null;
      const isRemote =
        job.location?.telecommuting === true || job.location?.workplace_type === "remote"
          ? true
          : null;

      return {
        ats: "workable" as const,
        external_id: job.shortcode ?? job.id ?? job.shortlink ?? job.title,
        company_name: source.company_name,
        title: job.title,
        location_text: locationText || null,
        apply_url: job.shortlink ?? job.url ?? "",
        description_text: description,
        is_remote: isRemote,
        posted_at: job.published_on ?? job.created_at ?? null,
      };
    });
  } catch (error) {
    console.error(`Workable fetch errored for ${source.company_name}:`, error);
    return [];
  }
}
