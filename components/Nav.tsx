"use client";

import Link from "next/link";
import { site, nav } from "@/lib/content";

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/85 backdrop-blur supports-[backdrop-filter]:bg-navy/70">
      <nav className="container-x flex h-20 items-center justify-between">
        <Link
          href="/"
          className="flex min-w-0 flex-col leading-none text-white"
          aria-label={`${site.name}, home`}
        >
          <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
            {site.name}
          </span>
          <span className="mt-1 truncate text-[10px] font-medium uppercase tracking-[0.14em] text-gold sm:text-[11px] sm:tracking-[0.16em]">
            {site.role}
          </span>
        </Link>

        <ul className="flex shrink-0 items-center gap-4 text-[13px] text-white/80 sm:gap-9 sm:text-sm">
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
      </nav>
    </header>
  );
}
