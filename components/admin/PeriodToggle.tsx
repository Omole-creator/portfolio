"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Bucket } from "@/lib/analytics/queries";

const BUCKETS: { value: Bucket; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
  { value: "year", label: "Year" },
];

export function PeriodToggle({
  bucket,
  year,
  availableYears,
}: {
  bucket: Bucket;
  year: number;
  availableYears: number[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(next: { bucket?: Bucket; year?: number }) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("bucket", next.bucket ?? bucket);
    params.set("year", String(next.year ?? year));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex rounded-full border border-line bg-white p-1">
        {BUCKETS.map((b) => (
          <button
            key={b.value}
            type="button"
            onClick={() => update({ bucket: b.value })}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              bucket === b.value
                ? "bg-navy text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <select
        value={year}
        onChange={(event) => update({ year: Number(event.target.value) })}
        className="rounded-full border border-line bg-white px-4 py-1.5 text-sm font-semibold text-ink"
      >
        {availableYears.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}
