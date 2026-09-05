import Link from "next/link";
import { marketingSite, marketingNav } from "@/lib/marketing-content";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export function MarketingFooter() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold">{marketingSite.name}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Creative marketing for startups and brands that want campaigns built AI-first.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <Link
              href="/marketing"
              className="text-white/70 transition-colors hover:text-white"
            >
              Home
            </Link>
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <TrackedLink
              href={`mailto:${marketingSite.contact.email}`}
              cta="email"
              className="text-white/70 transition-colors hover:text-white"
            >
              {marketingSite.contact.email}
            </TrackedLink>
            <TrackedLink
              href={marketingSite.contact.linkedin}
              cta="linkedin"
              external
              className="text-white/70 transition-colors hover:text-white"
            >
              LinkedIn
            </TrackedLink>
            <TrackedLink
              href={marketingSite.contact.whatsapp}
              cta="whatsapp"
              external
              className="text-white/70 transition-colors hover:text-white"
            >
              WhatsApp
            </TrackedLink>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {marketingSite.name}. All rights reserved.
          </p>
          <p>Built with Next.js and Claude Code.</p>
        </div>
      </div>
    </footer>
  );
}
