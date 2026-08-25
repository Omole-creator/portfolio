import type { TimeSeriesPoint } from "@/lib/analytics/queries";

export function TimeSeriesChart({ data }: { data: TimeSeriesPoint[] }) {
  if (!data.length) {
    return <p className="text-sm text-muted">No data for this period yet.</p>;
  }

  const max = Math.max(...data.map((d) => d.visitors), 1);

  return (
    <div className="flex h-40 gap-1.5">
      {data.map((point) => (
        <div
          key={point.bucket}
          className="group relative flex flex-1 flex-col justify-end"
        >
          <div
            className="rounded-t-sm bg-gold transition-colors group-hover:bg-gold-hover"
            style={{ height: `${Math.max((point.visitors / max) * 100, 2)}%` }}
          />
          <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-navy px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {point.bucket}: {point.visitors}
          </span>
        </div>
      ))}
    </div>
  );
}
