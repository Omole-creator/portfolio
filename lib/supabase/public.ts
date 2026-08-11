import { createClient } from "@supabase/supabase-js";

// Cookie-free client for the public blog pages. Reading cookies would opt those
// routes into dynamic rendering, and we want them static and revalidated on
// demand instead. Row level security limits this client to published posts.
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
