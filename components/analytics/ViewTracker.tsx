"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/track";

// Fires once when the wrapped content scrolls into view. Projects have no
// dedicated route to instrument a normal page view on, so "viewed" is
// defined as "scrolled into view" — the same signal Reveal.tsx already
// watches for, without the animation.
export function ViewTracker({
  eventType,
  resourceId,
  children,
}: {
  eventType: "project_view";
  resourceId: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const inView = useInView(ref, { once: true, margin: "-40% 0px -40% 0px" });
  const fired = useRef(false);

  if (inView && !fired.current) {
    fired.current = true;
    track({ event_type: eventType, resource_id: resourceId, path: pathname });
  }

  return <div ref={ref}>{children}</div>;
}
