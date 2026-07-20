import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { DEMO_MODE, SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

/**
 * Server-side Supabase client (Server Components, Route Handlers, Actions).
 * Returns null in demo mode.
 */
export async function createClient() {
  if (DEMO_MODE) return null;

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore, middleware refreshes.
        }
      },
    },
  });
}
