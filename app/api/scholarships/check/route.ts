import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { checkScholarships } from "@/lib/scholarships/check";

// Daily Vercel Cron (see vercel.json), authenticated the same way as
// /api/jobs/sync: Vercel sends Authorization: Bearer $CRON_SECRET.
export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ checked: false }, { status: 401 });
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return NextResponse.json(
      { checked: false, reason: "supabase not configured" },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const result = await checkScholarships(supabase);
  return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
}
