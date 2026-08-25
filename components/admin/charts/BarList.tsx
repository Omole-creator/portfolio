import type { RankedRow } from "@/lib/analytics/queries";

export function BarList({
  rows,
  emptyLabel = "No data yet.",
  maxItems = 8,
  formatLabel,
}: {
  rows: RankedRow[];
  emptyLabel?: string;
  maxItems?: number;
  formatLabel?: (id: string) => string;
}) {
  const items = rows.slice(0, maxItems);

  if (!items.length) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((row) => row.count), 1);

  return (
    <ul className="space-y-3">
      {items.map((row) => (
        <li key={row.id} className="text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-ink">
              {formatLabel ? formatLabel(row.id) : row.id}
            </span>
            <span className="shrink-0 font-semibold text-ink">{row.count}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-paper">
            <div
              className="h-full rounded-full bg-navy"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
