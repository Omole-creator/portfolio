"use client";

import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { site, nav } from "@/lib/content";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/85 backdrop-blur supports-[backdrop-filter]:bg-navy/70">
      <nav className="container-x flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex flex-col leading-none text-white"
          aria-label={`${site.name}, home`}
        >
          <span className="font-display text-lg font-semibold tracking-tight">
            {site.name}
          </span>
          <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-gold">
            {site.role}
          </span>
        </Link>

        <div className="flex items-center gap-6 md:gap-8">
          <ul className="hidden items-center gap-7 text-sm text-white/80 sm:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
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
      </nav>
    </header>
  );
}
