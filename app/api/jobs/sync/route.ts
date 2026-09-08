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

    // Plain insert, one row at a time, not upsert(..., { ignoreDuplicates:
    // true }): that sends Postgres an INSERT ... ON CONFLICT DO NOTHING,
    // which needs to check for an existing conflicting row - and since anon
    // has no SELECT policy on job_matches on purpose (it holds cover
    // letters, application emails, etc., never meant to be publicly
    // readable via the anon key), that conflict check itself gets rejected
    // by RLS, even for rows with no real conflict at all. A plain insert
    // triggers no such check; an actual duplicate just fails with a normal,
    // catchable 23505 unique-violation instead.
    for (const row of rows) {
      const { error } = await supabase.from("job_matches").insert(row);
      if (!error) {
        inserted += 1;
      } else if (error.code !== "23505") {
        console.error(`job sync: ${source.company_name} insert failed:`, error.message);
      }
    }
  }

  return NextResponse.json(
    { synced: true, sourcesChecked: sources.length, inserted },
    { headers: { "Cache-Control": "no-store" } },
  );
}
