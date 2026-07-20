import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the redirect from Supabase email links (signup confirmation,
 * magic link, password recovery). Exchanges the PKCE `code` for a session
 * cookie, then sends the user on to the dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=Could not verify your email link. Please try signing in.`
  );
}
