import { Play, Instagram, ArrowUpRight } from "lucide-react";
import { TrackedLink } from "@/components/analytics/TrackedLink";

const icons = { play: Play, instagram: Instagram };

// Fallback for external media (a hosted video page, an Instagram post) that
// can't be embedded, following the same pattern as WebWork's bordered text
// card for a project with no screenshot: link out rather than show nothing.
export function MediaLinkCard({
  href,
  label,
  icon,
  cta,
}: {
  href: string;
  label: string;
  icon: "play" | "instagram";
  cta: string;
}) {
  const Icon = icons[icon];

  return (
    <TrackedLink
      href={href}
      cta={cta}
      external
      className="group flex h-full min-h-[9rem] flex-col items-center justify-center gap-3 rounded-xl border border-line bg-white p-6 text-center shadow-[0_20px_50px_-24px_rgba(11,30,57,0.45)] transition-colors hover:border-gold-hover"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-gold">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-gold-hover">
        {label}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </TrackedLink>
  );
}
