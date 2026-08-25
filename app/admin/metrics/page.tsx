import Link from "next/link";
import { getAnalyticsDashboardData, type Bucket } from "@/lib/analytics/queries";
import { getPublishedPosts } from "@/lib/posts";
import { caseStudies } from "@/lib/content";
import { PeriodToggle } from "@/components/admin/PeriodToggle";
import { TimeSeriesChart } from "@/components/admin/charts/TimeSeriesChart";
import { BarList } from "@/components/admin/charts/BarList";

const VALID_BUCKETS: Bucket[] = ["day", "week", "month", "quarter", "year"];

const CTA_LABELS: Record<string, string> = {
  email: "Email",
  calendly: "Book a call",
  linkedin: "LinkedIn",
  whatsapp: "WhatsApp",
};

type Props = {
  searchParams: Promise<{ bucket?: string; year?: string }>;
};

export default async function MetricsPage({ searchParams }: Props) {
  const params = await searchParams;
  const bucket: Bucket = VALID_BUCKETS.includes(params.bucket as Bucket)
    ? (params.bucket as Bucket)
    : "month";
  const requestedYear = params.year
    ? Number(params.year)
    : new Date().getFullYear();

  const [data, posts] = await Promise.all([
    getAnalyticsDashboardData(bucket, requestedYear),
    getPublishedPosts(),
  ]);

  const projectNames = new Map(caseStudies.map((s) => [s.slug, s.name]));
  const postTitles = new Map(posts.map((p) => [p.slug, p.title]));

  return (
    <div className="container-x">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-hover">Metrics</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink md:text-4xl">
            How the site is doing
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Every number here counts a person once per project, once per
            post, and once per way of getting in touch, not once per page
            load. Times are West Africa Time.
          </p>
        </div>
        <PeriodToggle
          bucket={bucket}
          year={data.year}
          availableYears={data.availableYears}
        />
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <KpiCard label="Unique visitors" value={data.summary.totalVisitors} />
        <KpiCard
          label="Projects viewed"
          value={data.summary.totalProjectViews}
        />
        <KpiCard label="Posts read" value={data.summary.totalPostViews} />
        <KpiCard label="Conversions" value={data.summary.totalConversions} />
        <KpiCard
          label="Conversion rate"
          value={`${data.summary.conversionRate}%`}
        />
      </dl>

      <Section title={`Visitors by ${bucket}, ${data.year}`}>
        <TimeSeriesChart data={data.timeSeries} />
      </Section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Most-viewed projects">
          <BarList
            rows={data.topProjects}
            formatLabel={(id) => projectNames.get(id) ?? id}
            emptyLabel="No project views yet."
          />
        </Section>

        <Section title="CTA conversions">
          <BarList
            rows={data.ctaBreakdown}
            formatLabel={(id) => CTA_LABELS[id] ?? id}
            emptyLabel="No clicks yet."
          />
        </Section>
      </div>

      <Section title="Blog performance">
        {data.postPerformance.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-muted">
                  <th className="pb-2 font-semibold">Post</th>
                  <th className="pb-2 font-semibold">Readers</th>
                  <th className="pb-2 font-semibold">Conversions</th>
                  <th className="pb-2 font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.postPerformance.map((row) => (
                  <tr key={row.slug} className="border-t border-line">
                    <td className="py-2.5 pr-4">
                      <Link
                        href={`/blog/${row.slug}`}
                        target="_blank"
                        className="text-ink hover:text-gold-hover hover:underline"
                      >
                        {postTitles.get(row.slug) ?? row.slug}
                      </Link>
                    </td>
                    <td className="py-2.5 pr-4 text-ink">{row.viewers}</td>
                    <td className="py-2.5 pr-4 text-ink">{row.converters}</td>
                    <td className="py-2.5 text-ink">
                      {row.conversionRatePct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted">No posts read yet.</p>
        )}
      </Section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Traffic sources">
          <BarList rows={data.referrers} emptyLabel="No referrer data yet." />
        </Section>
        <Section title="Countries">
          <BarList
            rows={data.countries}
            emptyLabel="No location data yet. This fills in once the site is live on Vercel — it doesn't work on localhost."
          />
        </Section>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Devices">
          <BarList rows={data.devices} emptyLabel="No device data yet." />
        </Section>
        <Section title="Browsers">
          <BarList rows={data.browsers} emptyLabel="No browser data yet." />
        </Section>
      </div>

      <Section title="New vs. returning">
        <p className="text-sm leading-relaxed text-muted">
          {data.newVsReturning.new} new visitor
          {data.newVsReturning.new === 1 ? "" : "s"} this period, and{" "}
          {data.newVsReturning.returning} person
          {data.newVsReturning.returning === 1 ? "" : "s"} already seen
          before who showed up on a new page. Because everything here counts
          a person once per thing, ever, this isn&apos;t a repeat-visit
          count, it&apos;s people discovering something new.
        </p>
      </Section>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold text-ink">{value}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-line bg-white p-6">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}
