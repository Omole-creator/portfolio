import Image from "next/image";
import { tools } from "@/lib/content";

function Chip({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 rounded-full border border-line bg-white px-5 py-3">
      <Image
        src={logo}
        alt={`${name} logo`}
        width={28}
        height={28}
        className="h-6 w-6 object-contain"
      />
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
        <p className="eyebrow text-center text-muted">
          The tools I work in every day
        </p>
      </div>
      <div className="marquee-mask mt-7 flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 gap-4 pr-4">
          {row.map((t, i) => (
            <Chip key={`${t.name}-${i}`} name={t.name} logo={t.logo} />
          ))}
        </div>
        <div
          className="animate-marquee flex shrink-0 gap-4 pr-4"
          aria-hidden="true"
        >
          {row.map((t, i) => (
            <Chip key={`dup-${t.name}-${i}`} name={t.name} logo={t.logo} />
          ))}
        </div>
      </div>
    </section>
  );
}
