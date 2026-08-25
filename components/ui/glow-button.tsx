"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics/track";

// Glowing pill button, adapted from the pulse-beams button style into the
// site's navy and gold. Primary is a solid gold pill; ghost is a dark navy
// pill with a gold glow that rises on hover.

export function GlowButton({
  href,
  children,
  variant = "primary",
  external = false,
  className,
  cta,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  external?: boolean;
  className?: string;
  cta?: string;
}) {
  const pathname = usePathname();
  const externalProps = external
    ? { target: "_blank", rel: "noreferrer" }
    : {};
  const onClick = cta
    ? () => track({ event_type: "cta_click", resource_id: cta, path: pathname })
    : undefined;

  if (variant === "primary") {
    return (
      <a
        href={href}
        {...externalProps}
        onClick={onClick}
        className={cn(
          "group relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-gold px-4 py-3 text-sm font-semibold text-ink transition-transform duration-300 hover:-translate-y-0.5 sm:px-7 sm:py-3.5 sm:text-base",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="absolute -inset-2 -z-10 rounded-full bg-gold/40 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        />
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      {...externalProps}
      onClick={onClick}
      className={cn(
        "group relative inline-block shrink-0 rounded-full p-px transition-transform duration-300 hover:-translate-y-0.5",
        className,
      )}
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(75%_100%_at_50%_0%,rgba(194,154,69,0.6)_0%,rgba(194,154,69,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-navy/80 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur sm:px-7 sm:py-3.5 sm:text-base">
        {children}
      </span>
    </a>
  );
}
