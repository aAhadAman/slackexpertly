import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SlackOrgIntegration {
  orgId: string;
  botToken: string;
  botUserId: string | null;
}

/** Resolve which org + bot token a Slack team maps to. */
export async function getOrgByTeam(
  teamId: string
): Promise<SlackOrgIntegration | null> {
  const admin = createAdminClient();
  if (!admin) return null;

  const { data } = await admin
    .from("integrations")
    .select("org_id, config")
    .eq("provider", "slack")
    .eq("config->>team_id", teamId)
    .eq("connected", true)
    .maybeSingle();

  if (!data) return null;
  const config = (data.config ?? {}) as Record<string, string>;
  if (!config.bot_token) return null;

  return {
    orgId: data.org_id,
    botToken: config.bot_token,
    botUserId: config.bot_user_id ?? null,
  };
}

/**
 * Placeholder responder (pre-AI): file the question into the HR escalation
 * inbox and log it for analytics. Once RAG lands, this is where the bot will
 * try to answer first and only escalate on low confidence.
 */
export async function fileQuestion(input: {
  orgId: string;
  question: string;
  employeeName: string;
  channel: string;
}): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;

  await admin.from("escalations").insert({
    org_id: input.orgId,
    question: input.question,
    employee_name: input.employeeName,
    channel: input.channel,
    reason: "Routed to HR (AI answering not enabled yet)",
    status: "open",
  });

  await admin.from("questions").insert({
    org_id: input.orgId,
    question: input.question,
    was_escalated: true,
    channel: input.channel,
    employee_name: input.employeeName,
  });
}

export const CONFIRMATION_TEXT =
  "Thanks — I've passed your question to the HR team and they'll follow up with you shortly. :white_check_mark:";
