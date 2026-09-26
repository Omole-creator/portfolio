export type OutcomeCounts = {
  applied: number;
  heardBack: number;
  interviews: number;
  offers: number;
  rejections: number;
};

// Same colors as the milestone toggles in app/admin/jobs/AppliedRow.tsx, so
// a bar reads as the button it counts.
const BARS: { key: keyof OutcomeCounts; label: string; className: string }[] = [
  { key: "applied", label: "Applied", className: "bg-gold" },
  { key: "heardBack", label: "Heard back", className: "bg-navy" },
  { key: "interviews", label: "Interviewed", className: "bg-navy" },
  { key: "offers", label: "Got the job", className: "bg-green-700" },
  { key: "rejections", label: "Rejected", className: "bg-red-700" },
];

// A vertical bar chart of how applications turned out, from "Applied" down
// to "Rejected". Every bar is scaled against the applied count, and each one
// after the first also shows its share of applications.
export function OutcomeChart({
  counts,
  size = "lg",
}: {
  counts: OutcomeCounts;
  size?: "sm" | "lg";
}) {
  const max = Math.max(counts.applied, 1);
  const height = size === "lg" ? "h-48" : "h-28";

  return (
    <div role="img" aria-label={BARS.map((b) => `${b.label}: ${counts[b.key]}`).join(", ")}>
      <div className={`flex ${height} items-end gap-3 border-b border-line sm:gap-5`}>
        {BARS.map((bar) => {
          const value = counts[bar.key];
          return (
            <div key={bar.key} className="flex h-full flex-1 flex-col justify-end">
              <span className="mb-1 text-center text-sm font-semibold text-ink">{value}</span>
              <div
                className={`rounded-t-md ${bar.className}`}
                style={{ height: value ? `${(value / max) * 100}%` : "2px" }}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-3 sm:gap-5">
        {BARS.map((bar) => (
          <div key={bar.key} className="flex-1 text-center">
            <p className="text-xs font-semibold leading-tight text-ink">{bar.label}</p>
            {bar.key !== "applied" && counts.applied ? (
              <p className="mt-0.5 text-xs text-muted">
                {Math.round((counts[bar.key] / counts.applied) * 100)}%
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
