import type { TrackPayload } from "./types";

// Fire-and-forget. Never throws, never blocks navigation or the caller —
// a blocked/failed analytics call must not break the page.
export function track(payload: TrackPayload) {
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // no-op
  }
}
