import { createClient } from "@/lib/supabase/server";

// Aggregation for /admin/metrics. Supabase's PostgREST client has no way to
// run raw date_trunc/AT TIME ZONE SQL, so instead of adding Postgres
// functions (more manual SQL to paste into the dashboard, on top of the
// migrations this feature already needs) we fetch the event log — append
// -only, one row per unique visit, so it stays small for a personal
// portfolio's traffic for a long time — and aggregate it here.

export type Bucket = "day" | "week" | "month" | "quarter" | "year";

type RawEvent = {
  visitor_id: string;
  event_type: string;
  resource_id: string;
  path: string;
  referrer: string | null;
  country: string | null;
  device_type: string | null;
  browser: string | null;
  occurred_at: string;
  first_seen_at: string;
};

export type MetricsSummary = {
  totalVisitors: number;
  totalProjectViews: number;
  totalPostViews: number;
  totalConversions: number;
  conversionRate: number;
};

export type TimeSeriesPoint = { bucket: string; visitors: number };
export type RankedRow = { id: string; count: number };
export type PostPerformanceRow = {
  slug: string;
  viewers: number;
  converters: number;
  conversionRatePct: number;
};

export type AnalyticsDashboardData = {
  year: number;
  availableYears: number[];
  summary: MetricsSummary;
  timeSeries: TimeSeriesPoint[];
  topProjects: RankedRow[];
  postPerformance: PostPerformanceRow[];
  ctaBreakdown: RankedRow[];
  referrers: RankedRow[];
  countries: RankedRow[];
  devices: RankedRow[];
  browsers: RankedRow[];
  newVsReturning: { new: number; returning: number };
};

// Africa/Lagos is a fixed UTC+1 with no DST, so a flat offset is correct.
const WAT_OFFSET_MS = 60 * 60 * 1000;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function watParts(iso: string) {
  const shifted = new Date(new Date(iso).getTime() + WAT_OFFSET_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    date: shifted.getUTCDate(),
    day: shifted.getUTCDay(),
  };
}

function bucketKey(iso: string, bucket: Bucket): string {
  const { year, month, date, day } = watParts(iso);
  switch (bucket) {
    case "day":
      return `${year}-${pad(month + 1)}-${pad(date)}`;
    case "week": {
      const start = new Date(Date.UTC(year, month, date));
      const mondayOffset = (day + 6) % 7; // 0 = Monday
      start.setUTCDate(start.getUTCDate() - mondayOffset);
      return `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-${pad(start.getUTCDate())}`;
    }
    case "month":
      return `${year}-${pad(month + 1)}`;
    case "quarter":
      return `${year}-Q${Math.floor(month / 3) + 1}`;
    case "year":
      return `${year}`;
  }
}

function countUniqueVisitors(rows: RawEvent[]) {
  return new Set(rows.map((r) => r.visitor_id)).size;
}

function rankByUniqueVisitor(
  rows: RawEvent[],
  key: (row: RawEvent) => string,
): RankedRow[] {
  const map = new Map<string, Set<string>>();
  for (const row of rows) {
    const k = key(row);
    if (!map.has(k)) map.set(k, new Set());
    map.get(k)!.add(row.visitor_id);
  }
  return Array.from(map.entries())
    .map(([id, visitors]) => ({ id, count: visitors.size }))
    .sort((a, b) => b.count - a.count);
}

function postSlugFromPath(path: string): string | null {
  const match = /^\/blog\/([^/]+)\/?$/.exec(path);
  return match ? match[1] : null;
}

export async function getAnalyticsDashboardData(
  bucket: Bucket,
  requestedYear: number,
): Promise<AnalyticsDashboardData> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("analytics_events")
    .select(
      "visitor_id, event_type, resource_id, path, referrer, country, device_type, browser, occurred_at, first_seen_at",
    )
    .order("occurred_at", { ascending: true })
    .limit(50000);

  const rows: RawEvent[] = error || !data ? [] : (data as RawEvent[]);

  const pageViews = rows.filter((r) => r.event_type === "page_view");
  const projectViews = rows.filter((r) => r.event_type === "project_view");
  const postViews = rows.filter((r) => r.event_type === "post_view");
  const ctaClicks = rows.filter((r) => r.event_type === "cta_click");

  const availableYears = Array.from(
    new Set(pageViews.map((r) => watParts(r.occurred_at).year)),
  ).sort((a, b) => b - a);
  const year =
    availableYears.length && !availableYears.includes(requestedYear)
      ? availableYears[0]
      : requestedYear;

  const inYear = (r: RawEvent) => watParts(r.occurred_at).year === year;

  const seriesMap = new Map<string, Set<string>>();
  for (const row of pageViews.filter(inYear)) {
    const key = bucketKey(row.occurred_at, bucket);
    if (!seriesMap.has(key)) seriesMap.set(key, new Set());
    seriesMap.get(key)!.add(row.visitor_id);
  }
  const timeSeries: TimeSeriesPoint[] = Array.from(seriesMap.entries())
    .map(([b, visitors]) => ({ bucket: b, visitors: visitors.size }))
    .sort((a, b) => (a.bucket < b.bucket ? -1 : 1));

  const viewersBySlug = new Map<string, Set<string>>();
  for (const row of postViews) {
    if (!viewersBySlug.has(row.resource_id)) viewersBySlug.set(row.resource_id, new Set());
    viewersBySlug.get(row.resource_id)!.add(row.visitor_id);
  }
  const convertersBySlug = new Map<string, Set<string>>();
  for (const row of ctaClicks) {
    const slug = postSlugFromPath(row.path);
    if (!slug) continue;
    if (!convertersBySlug.has(slug)) convertersBySlug.set(slug, new Set());
    convertersBySlug.get(slug)!.add(row.visitor_id);
  }
  const postPerformance: PostPerformanceRow[] = Array.from(viewersBySlug.entries())
    .map(([slug, viewers]) => {
      const converters = convertersBySlug.get(slug)?.size ?? 0;
      return {
        slug,
        viewers: viewers.size,
        converters,
        conversionRatePct: viewers.size
          ? Math.round((converters / viewers.size) * 1000) / 10
          : 0,
      };
    })
    .sort((a, b) => b.viewers - a.viewers);

  const newVisitors = new Set<string>();
  const returningVisitors = new Set<string>();
  for (const row of pageViews.filter(inYear)) {
    const occurredDay = bucketKey(row.occurred_at, "day");
    const firstSeenDay = bucketKey(row.first_seen_at, "day");
    if (occurredDay === firstSeenDay) newVisitors.add(row.visitor_id);
    else returningVisitors.add(row.visitor_id);
  }

  const totalVisitors = countUniqueVisitors(pageViews);
  const totalConversions = countUniqueVisitors(ctaClicks);

  return {
    year,
    availableYears: availableYears.length ? availableYears : [new Date().getFullYear()],
    summary: {
      totalVisitors,
      totalProjectViews: countUniqueVisitors(projectViews),
      totalPostViews: countUniqueVisitors(postViews),
      totalConversions,
      conversionRate: totalVisitors
        ? Math.round((totalConversions / totalVisitors) * 1000) / 10
        : 0,
    },
    timeSeries,
    topProjects: rankByUniqueVisitor(projectViews, (r) => r.resource_id),
    postPerformance,
    ctaBreakdown: rankByUniqueVisitor(ctaClicks, (r) => r.resource_id),
    referrers: rankByUniqueVisitor(pageViews, (r) => {
      if (!r.referrer) return "Direct";
      try {
        return new URL(r.referrer).hostname;
      } catch {
        return "Direct";
      }
    }),
    countries: rankByUniqueVisitor(pageViews, (r) => r.country ?? "Unknown"),
    devices: rankByUniqueVisitor(pageViews, (r) => r.device_type ?? "unknown"),
    browsers: rankByUniqueVisitor(pageViews, (r) => r.browser ?? "unknown"),
    newVsReturning: { new: newVisitors.size, returning: returningVisitors.size },
  };
}
