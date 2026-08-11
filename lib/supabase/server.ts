import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Server client for server components, server actions, and route handlers.
// Reads the session from cookies so /admin knows who is signed in.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Server components cannot set cookies. The middleware refreshes the
            // session on every request, so it is safe to ignore this here.
          }
        },
      },
    },
  );
}
