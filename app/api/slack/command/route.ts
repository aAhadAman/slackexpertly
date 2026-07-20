import { NextResponse, after } from "next/server";
import { verifySlackSignature } from "@/lib/slack";
import {
  getOrgByTeam,
  fileQuestion,
  CONFIRMATION_TEXT,
} from "@/lib/slack-handler";

export const runtime = "nodejs";

/**
 * Slash command endpoint (e.g. /askhr <question>).
 * Replies with an EPHEMERAL message — only the person who ran the command
 * sees it, even in a shared channel.
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const ts = request.headers.get("x-slack-request-timestamp");
  const sig = request.headers.get("x-slack-signature");

  if (!verifySlackSignature(rawBody, ts, sig)) {
    return new NextResponse("invalid signature", { status: 401 });
  }

  const params = new URLSearchParams(rawBody);
  const teamId = params.get("team_id") ?? "";
  const text = (params.get("text") ?? "").trim();
  const userName = params.get("user_name") ?? "Employee";

  if (!text) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "Ask me a benefits or policy question, e.g. `/askhr how much is my PPO deductible?`",
    });
  }

  after(async () => {
    const org = await getOrgByTeam(teamId);
    if (!org) return;
    await fileQuestion({
      orgId: org.orgId,
      question: text,
      employeeName: userName,
      channel: "Slash command",
    });
  });

  return NextResponse.json({
    response_type: "ephemeral",
    text: CONFIRMATION_TEXT,
  });
}
