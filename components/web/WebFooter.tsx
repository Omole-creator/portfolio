import Link from "next/link";
import { webSite, webNav } from "@/lib/web-content";
import { TrackedLink } from "@/components/analytics/TrackedLink";

export function WebFooter() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold">{webSite.name}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Professional websites for small businesses, designed and built fast.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            <Link
              href="/web"
              className="text-white/70 transition-colors hover:text-white"
            >
              Home
            </Link>
            {webNav.map((item) => (
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
              href={`mailto:${webSite.contact.email}`}
              cta="email"
              className="text-white/70 transition-colors hover:text-white"
            >
              {webSite.contact.email}
            </TrackedLink>
            <TrackedLink
              href={webSite.contact.linkedin}
              cta="linkedin"
              external
              className="text-white/70 transition-colors hover:text-white"
            >
              LinkedIn
            </TrackedLink>
            <TrackedLink
              href={webSite.contact.whatsapp}
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
            &copy; {new Date().getFullYear()} {webSite.name}. All rights reserved.
          </p>
          <p>Built with Next.js and Claude Code.</p>
        </div>
      </div>
    </footer>
  );
}
