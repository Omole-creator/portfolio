import { site, nav } from "@/lib/content";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-x py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-lg font-semibold">{site.name}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.16em] text-gold">
              {site.role}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 text-sm">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="text-white/70 transition-colors hover:text-white"
            >
              Contact
            </a>
          </nav>

          <div className="flex flex-col gap-3 text-sm">
            <a
              href={`mailto:${site.contact.email}`}
              className="text-white/70 transition-colors hover:text-white"
            >
              {site.contact.email}
            </a>
            <a
              href={site.contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-white/70 transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={site.contact.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="text-white/70 transition-colors hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Built with Next.js and Claude Code.</p>
        </div>
      </div>
    </footer>
  );
}
