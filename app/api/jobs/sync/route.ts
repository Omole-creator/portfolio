import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { getActiveJobSources } from "@/lib/jobs/sources";
import { fetchForSource } from "@/lib/jobs/fetchers";
import { classifyJob } from "@/lib/jobs/classify";

// Vercel Cron issues a GET request once a day (see vercel.json) with an
// Authorization: Bearer $CRON_SECRET header, automatically added because
// CRON_SECRET is set on the project. Anyone else calling this without that
// header gets a 401.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ synced: false }, { status: 401 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json(
      { synced: false, reason: "supabase not configured" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const sources = await getActiveJobSources();
  let inserted = 0;

  for (const source of sources) {
    const jobs = await fetchForSource(source);

    const rows = jobs
      .map((job) => {
        const classified = classifyJob(job, source);
        if (!classified || !job.apply_url) return null;
        return {
          source_id: source.id,
          ats: job.ats,
          external_id: job.external_id,
          company_name: job.company_name,
          title: job.title,
          location_text: job.location_text,
          eligibility: classified.eligibility,
          apply_url: job.apply_url,
          description_text: job.description_text,
          track: classified.track,
          keyword_hits: classified.keyword_hits,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);

    if (rows.length) {
      const { error, count } = await supabase
        .from("job_matches")
        .upsert(rows, { onConflict: "ats,external_id", ignoreDuplicates: true, count: "exact" });

      if (error) {
        console.error(`job sync: ${source.company_name} upsert failed:`, error.message);
      } else {
        inserted += count ?? 0;
      }
    }
  }

  return NextResponse.json(
    { synced: true, sourcesChecked: sources.length, inserted },
    { headers: { "Cache-Control": "no-store" } },
  );
}
