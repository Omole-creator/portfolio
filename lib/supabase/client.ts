import { createBrowserClient } from "@supabase/ssr";

// Browser client. The anon key is meant to be public: row level security on the
// posts table is what actually decides who can read drafts and who can write.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
