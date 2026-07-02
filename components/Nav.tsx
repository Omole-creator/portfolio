"use client";

import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { site, nav } from "@/lib/content";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/80 shadow-[0_1px_0_rgba(255,255,255,0.06)]"
          : "bg-transparent"
      }`}
    >
      <nav className="container-x flex h-20 items-center justify-between">
        <a
          href="#top"
          className="flex flex-col leading-none text-white"
          aria-label={`${site.name}, back to top`}
        >
          <span className="font-display text-lg font-semibold tracking-tight">
            {site.name}
          </span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
            {site.role}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7 text-sm text-white/80">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={site.contact.calendly}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-hover"
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Book a call
          </a>
        </div>

        <a
          href={site.contact.calendly}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-gold-hover md:hidden"
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Book a call
        </a>
      </nav>
    </header>
  );
}
