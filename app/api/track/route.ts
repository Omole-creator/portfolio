import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { parseUserAgent } from "@/lib/analytics/parseUserAgent";
import type { AnalyticsEventType } from "@/lib/analytics/types";

const EVENT_TYPES: AnalyticsEventType[] = [
  "page_view",
  "project_view",
  "post_view",
  "cta_click",
];

const VISITOR_COOKIE = "av_id";
const FIRST_SEEN_COOKIE = "av_fs";
const TWO_YEARS = 60 * 60 * 24 * 730;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ recorded: false }, { status: 400 });
  }

  const { event_type, resource_id, path } = (body ?? {}) as {
    event_type?: string;
    resource_id?: string;
    path?: string;
  };

  if (
    !event_type ||
    !EVENT_TYPES.includes(event_type as AnalyticsEventType) ||
    typeof resource_id !== "string" ||
    !resource_id ||
    typeof path !== "string" ||
    !path
  ) {
    return NextResponse.json({ recorded: false }, { status: 400 });
  }

  const supabase = createPublicClient();

  const existingVisitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  const existingFirstSeen = request.cookies.get(FIRST_SEEN_COOKIE)?.value;
  const visitorId = existingVisitorId ?? crypto.randomUUID();
  const firstSeenAt = existingFirstSeen ?? new Date().toISOString();

  if (supabase) {
    const ua = request.headers.get("user-agent");
    const { device_type, browser, os } = parseUserAgent(ua);

    await supabase.from("analytics_events").upsert(
      {
        visitor_id: visitorId,
        event_type,
        resource_id,
        path,
        referrer: request.headers.get("referer"),
        country: request.headers.get("x-vercel-ip-country"),
        region: request.headers.get("x-vercel-ip-country-region"),
        city: decodeCity(request.headers.get("x-vercel-ip-city")),
        device_type,
        browser,
        os,
        user_agent: ua,
        first_seen_at: firstSeenAt,
      },
      { onConflict: "visitor_id,event_type,resource_id", ignoreDuplicates: true },
    );
  }

  const response = NextResponse.json(
    { recorded: Boolean(supabase) },
    { headers: { "Cache-Control": "no-store" } },
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: TWO_YEARS,
  };
  response.cookies.set(VISITOR_COOKIE, visitorId, cookieOptions);
  response.cookies.set(FIRST_SEEN_COOKIE, firstSeenAt, cookieOptions);

  return response;
}

function decodeCity(raw: string | null) {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
