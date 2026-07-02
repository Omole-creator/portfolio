import { tools } from "@/lib/content";

function initials(name: string) {
  const parts = name.split(" ");
  if (parts.length === 1) return name.slice(0, 2);
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Chip({ name }: { name: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-white px-5 py-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-[11px] font-semibold text-gold">
        {initials(name)}
      </span>
      <span className="whitespace-nowrap text-sm font-medium text-ink">
        {name}
      </span>
    </div>
  );
}

export function ToolsMarquee() {
  const row = [...tools, ...tools];

  return (
    <section
      aria-label="Tools I work with"
      className="border-y border-line bg-paper py-10"
    >
      <div className="container-x">
        <p className="eyebrow text-center text-muted">The tools I work in every day</p>
      </div>
      <div className="marquee-mask mt-7 flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-4 pr-4">
          {row.map((name, i) => (
            <Chip key={`${name}-${i}`} name={name} />
          ))}
        </div>
        <div
          className="animate-marquee flex shrink-0 gap-4 pr-4"
          aria-hidden="true"
        >
          {row.map((name, i) => (
            <Chip key={`dup-${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
