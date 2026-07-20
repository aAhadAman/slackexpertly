import { NextResponse } from "next/server";
import { exchangeSlackCode } from "@/lib/slack";
import { getCurrentOrg } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Slack OAuth redirect. The install is started from the dashboard by a
 * logged-in HR manager; `state` carries their org id. We exchange the code
 * for a bot token and store it against that org (verifying membership first).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const oauthError = searchParams.get("error");

  // Use the configured public URL (not the request origin) so the redirect_uri
  // in the token exchange matches the one used at the authorize step — the
  // request origin can arrive as localhost behind a tunnel/proxy.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? origin;
  const back = `${appUrl}/dashboard/integrations`;

  if (oauthError) {
    return NextResponse.redirect(`${back}?slack=denied`);
  }
  if (!code || !state) {
    return NextResponse.redirect(`${back}?slack=error`);
  }

  // The installer must be signed in and a member of the target org.
  const org = await getCurrentOrg();
  if (!org || org.id !== state) {
    return NextResponse.redirect(`${back}?slack=unauthorized`);
  }

  const result = await exchangeSlackCode(code, `${appUrl}/api/slack/oauth`);
  if (!result.ok || !result.botToken || !result.teamId) {
    return NextResponse.redirect(`${back}?slack=error`);
  }

  const supabase = await createClient();
  if (!supabase) return NextResponse.redirect(`${back}?slack=error`);

  const { error } = await supabase.from("integrations").upsert(
    {
      org_id: org.id,
      provider: "slack",
      connected: true,
      workspace: result.teamName ?? "Slack workspace",
      slack_team_id: result.teamId,
      connected_at: new Date().toISOString(),
      config: {
        team_id: result.teamId,
        team_name: result.teamName,
        bot_token: result.botToken,
        bot_user_id: result.botUserId,
        scope: result.scope,
      },
    },
    { onConflict: "org_id,provider" }
  );

  if (error) return NextResponse.redirect(`${back}?slack=error`);
  return NextResponse.redirect(`${back}?slack=connected`);
}
