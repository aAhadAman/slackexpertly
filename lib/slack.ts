import "server-only";
import crypto from "node:crypto";
import { WebClient } from "@slack/web-api";

export const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID ?? "";
export const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET ?? "";
export const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET ?? "";
export const SLACK_SLASH_COMMAND =
  process.env.SLACK_SLASH_COMMAND ?? "/askhr";

export const SLACK_CONFIGURED =
  !!SLACK_CLIENT_ID && !!SLACK_CLIENT_SECRET && !!SLACK_SIGNING_SECRET;

// Scopes: DMs + slash command + posting + reading the asker's name.
const SLACK_SCOPES = [
  "commands",
  "chat:write",
  "im:history",
  "im:write",
  "users:read",
].join(",");

/** Build the "Add to Slack" install URL, carrying the org id in `state`. */
export function buildInstallUrl(orgId: string, appUrl: string): string | null {
  if (!SLACK_CONFIGURED) return null;
  const redirect = `${appUrl}/api/slack/oauth`;
  const params = new URLSearchParams({
    client_id: SLACK_CLIENT_ID,
    scope: SLACK_SCOPES,
    redirect_uri: redirect,
    state: orgId,
  });
  return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
}

/**
 * Verify a request genuinely came from Slack (HMAC over the raw body),
 * and reject anything older than 5 minutes (replay protection).
 */
export function verifySlackSignature(
  rawBody: string,
  timestamp: string | null,
  signature: string | null
): boolean {
  if (!SLACK_SIGNING_SECRET || !timestamp || !signature) return false;

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (Number.isNaN(age) || age > 60 * 5) return false;

  const base = `v0:${timestamp}:${rawBody}`;
  const digest =
    "v0=" +
    crypto
      .createHmac("sha256", SLACK_SIGNING_SECRET)
      .update(base)
      .digest("hex");

  const a = Buffer.from(digest);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/** Exchange an OAuth `code` for a workspace bot token. */
export async function exchangeSlackCode(
  code: string,
  redirectUri: string
): Promise<{
  ok: boolean;
  error?: string;
  botToken?: string;
  teamId?: string;
  teamName?: string;
  botUserId?: string;
  scope?: string;
}> {
  const res = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const data = await res.json();
  if (!data.ok) return { ok: false, error: data.error ?? "oauth_failed" };
  return {
    ok: true,
    botToken: data.access_token,
    teamId: data.team?.id,
    teamName: data.team?.name,
    botUserId: data.bot_user_id,
    scope: data.scope,
  };
}

export function slackClient(token: string): WebClient {
  return new WebClient(token);
}

/** Best-effort display name for a Slack user id. */
export async function getSlackUserName(
  client: WebClient,
  userId: string
): Promise<string> {
  try {
    const res = await client.users.info({ user: userId });
    const p = res.user?.profile;
    return (
      p?.display_name ||
      p?.real_name ||
      res.user?.name ||
      "Employee"
    );
  } catch {
    return "Employee";
  }
}
