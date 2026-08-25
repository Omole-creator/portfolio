"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/track";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  cta: string;
  external?: boolean;
  children: ReactNode;
};

// Drop-in replacement for a plain <a>: same markup and navigation behavior,
// plus a fire-and-forget cta_click event. Never blocks the click.
export function TrackedLink({ href, cta, external, children, ...rest }: Props) {
  const pathname = usePathname();

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      {...rest}
      onClick={(event) => {
        track({ event_type: "cta_click", resource_id: cta, path: pathname });
        rest.onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
