"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { site, nav } from "@/lib/content";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-navy/85 backdrop-blur supports-[backdrop-filter]:bg-navy/70">
      <nav className="container-x flex h-20 items-center justify-between">
        <Link
          href="/"
          className="text-white"
          aria-label={`${site.name}, home`}
          onClick={() => setOpen(false)}
        >
          <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
            {site.name}
          </span>
        </Link>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:text-white"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <ul
            className={`absolute right-0 top-14 min-w-[11rem] rounded-2xl border border-white/10 bg-navy-deep p-2 text-sm text-white/80 shadow-xl transition-all duration-200 ${
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-2.5 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
