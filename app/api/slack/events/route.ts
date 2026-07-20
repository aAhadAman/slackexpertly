import { NextResponse, after } from "next/server";
import { verifySlackSignature, slackClient, getSlackUserName } from "@/lib/slack";
import {
  getOrgByTeam,
  fileQuestion,
  CONFIRMATION_TEXT,
} from "@/lib/slack-handler";

export const runtime = "nodejs";

/**
 * Slack Events API endpoint. Handles direct messages to the bot.
 * We verify the signature, ACK within Slack's 3s window, then do the work
 * in an `after()` background task.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const ts = request.headers.get("x-slack-request-timestamp");
  const sig = request.headers.get("x-slack-signature");

  if (!verifySlackSignature(rawBody, ts, sig)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  // URL verification handshake (when you set the Events URL in Slack).
  if (payload.type === "url_verification") {
    return NextResponse.json({ challenge: payload.challenge });
  }

  if (payload.type === "event_callback") {
    const event = payload.event;
    const isDirectMessage =
      event?.type === "message" &&
      event?.channel_type === "im" &&
      !event?.bot_id && // ignore other bots
      !event?.subtype && // ignore edits/joins/etc.
      typeof event?.text === "string" &&
      event.text.trim().length > 0;

    if (isDirectMessage) {
      const teamId: string = payload.team_id;
      const channel: string = event.channel;
      const userId: string = event.user;
      const text: string = event.text.trim();

      // Do the slow bits after acking.
      after(async () => {
        const org = await getOrgByTeam(teamId);
        if (!org) return;

        // Guard against the bot replying to itself.
        if (org.botUserId && userId === org.botUserId) return;

        const client = slackClient(org.botToken);
        const name = await getSlackUserName(client, userId);

        await fileQuestion({
          orgId: org.orgId,
          question: text,
          employeeName: name,
          channel: "Direct message",
        });

        await client.chat.postMessage({
          channel,
          text: CONFIRMATION_TEXT,
        });
      });
    }
  }

  // Always ACK fast so Slack doesn't retry.
  return NextResponse.json({ ok: true });
}
