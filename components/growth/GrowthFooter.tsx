import Link from "next/link";
import { growthSite, growthNav } from "@/lib/growth-content";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export function GrowthFooter() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold">{growthSite.name}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Growth marketing for startups and businesses that want more customers.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <Link
              href="/growth"
              className="text-white/70 transition-colors hover:text-white"
            >
              Home
            </Link>
            {growthNav.map((item) => (
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
              href={`mailto:${growthSite.contact.email}`}
              cta="email"
              className="text-white/70 transition-colors hover:text-white"
            >
              {growthSite.contact.email}
            </TrackedLink>
            <TrackedLink
              href={growthSite.contact.linkedin}
              cta="linkedin"
              external
              className="text-white/70 transition-colors hover:text-white"
            >
              LinkedIn
            </TrackedLink>
            <TrackedLink
              href={growthSite.contact.whatsapp}
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
            &copy; {new Date().getFullYear()} {growthSite.name}. All rights reserved.
          </p>
          <p>Built with Next.js and Claude Code.</p>
        </div>
      </div>
    </footer>
  );
}
