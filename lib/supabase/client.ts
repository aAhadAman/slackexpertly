"use client";

import { createBrowserClient } from "@supabase/ssr";
import { DEMO_MODE, SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/config";

/**
 * Browser-side Supabase client. Returns null in demo mode so callers can
 * fall back to mock data / simulated auth without crashing.
 */
export function createClient() {
  if (DEMO_MODE) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
