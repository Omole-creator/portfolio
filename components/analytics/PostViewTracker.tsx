"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics/track";

export function PostViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    track({
      event_type: "post_view",
      resource_id: slug,
      path: `/blog/${slug}`,
    });
  }, [slug]);

  return null;
}
