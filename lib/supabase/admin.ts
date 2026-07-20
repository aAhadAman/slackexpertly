import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/config";

/**
 * Service-role Supabase client. Bypasses RLS — use ONLY in trusted
 * server-to-server contexts with no user session (e.g. Slack webhooks,
 * document ingestion). NEVER import this into a client component.
 *
 * Returns null if the service role key isn't configured yet.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  return createSupabaseClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
