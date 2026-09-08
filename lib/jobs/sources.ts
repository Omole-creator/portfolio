import { createPublicClient } from "@/lib/supabase/public";
import type { JobSource } from "./types";

/** Active job sources, for the daily sync route. Empty list if Supabase is unset. */
export async function getActiveJobSources(): Promise<JobSource[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("job_sources")
    .select("*")
    .eq("active", true)
    .order("company_name", { ascending: true });

  if (error) {
    console.error("Could not load job sources:", error.message);
    return [];
  }

  return (data ?? []) as JobSource[];
}
