"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics/track";

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track({ event_type: "page_view", resource_id: pathname, path: pathname });
  }, [pathname]);

  return null;
}
