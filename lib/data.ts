import "server-only";
import { cache } from "react";
import { DEMO_MODE } from "./config";
import { createClient } from "./supabase/server";
import * as mock from "./mock";
import type {
  PolicyDoc,
  Escalation,
  Integration,
  DashboardStats,
} from "./types";

export interface Org {
  id: string;
  name: string;
  plan: "starter" | "team" | "pro";
  subscription_status: string;
  trial_ends_at: string | null;
  bot_name: string;
  bot_tone: "friendly" | "professional" | "concise";
  fallback_message: string;
  confidence_threshold: number;
  active_channels: string[];
}

const DEMO_ORG: Org = {
  id: "demo",
  name: mock.MOCK_ORG,
  plan: "team",
  subscription_status: "trialing",
  trial_ends_at: null,
  bot_name: "Policy Expert",
  bot_tone: "friendly",
  fallback_message:
    "I'm not fully sure about that one — I've passed it to our HR team and they'll get back to you shortly.",
  confidence_threshold: 70,
  active_channels: ["#ask-hr", "#benefits"],
};

/**
 * Resolve the signed-in user's organization, creating one on the fly
 * (via the ensure_org RPC) if the trigger hasn't provisioned it yet.
 * Cached per request so multiple components share one lookup.
 */
export const getCurrentOrg = cache(async (): Promise<Org | null> => {
  if (DEMO_MODE) return DEMO_ORG;

  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Try existing membership first.
  const { data: membership } = await supabase
    .from("organization_members")
    .select("organizations(*)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  let org = (membership?.organizations as unknown as Org) ?? null;

  // Self-heal for accounts created before the trigger existed.
  if (!org) {
    const { data: orgId } = await supabase.rpc("ensure_org");
    if (orgId) {
      const { data } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", orgId)
        .maybeSingle();
      org = (data as unknown as Org) ?? null;
    }
  }

  return org;
});

export async function getDocuments(): Promise<PolicyDoc[]> {
  if (DEMO_MODE) return mock.mockDocs;
  const org = await getCurrentOrg();
  const supabase = await createClient();
  if (!org || !supabase) return [];

  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  return (data ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    sizeBytes: Number(d.size_bytes),
    pages: d.pages,
    chunks: d.chunks,
    status: d.status,
    uploadedAt: d.created_at,
    storagePath: d.storage_path,
  }));
}

export async function getEscalations(): Promise<Escalation[]> {
  if (DEMO_MODE) return mock.mockEscalations;
  const org = await getCurrentOrg();
  const supabase = await createClient();
  if (!org || !supabase) return [];

  const { data } = await supabase
    .from("escalations")
    .select("*")
    .eq("org_id", org.id)
    .order("asked_at", { ascending: false });

  return (data ?? []).map((e) => ({
    id: e.id,
    question: e.question,
    employee: e.employee_name ?? "Employee",
    channel: e.channel ?? "DM",
    reason: e.reason ?? "",
    status: e.status,
    askedAt: e.asked_at,
  }));
}

export async function getIntegrations(): Promise<Integration[]> {
  if (DEMO_MODE) return mock.mockIntegrations;
  const org = await getCurrentOrg();
  const supabase = await createClient();
  if (!org || !supabase) return defaultIntegrations();

  const { data } = await supabase
    .from("integrations")
    .select("*")
    .eq("org_id", org.id);

  const byProvider = new Map((data ?? []).map((r) => [r.provider, r]));
  return (["slack", "teams"] as const).map((provider) => {
    const row = byProvider.get(provider);
    return {
      id: provider,
      name: provider === "slack" ? "Slack" : "Microsoft Teams",
      connected: !!row?.connected,
      workspace: row?.workspace ?? undefined,
      connectedAt: row?.connected_at ?? undefined,
    };
  });
}

function defaultIntegrations(): Integration[] {
  return [
    { id: "slack", name: "Slack", connected: false },
    { id: "teams", name: "Microsoft Teams", connected: false },
  ];
}

export interface OverviewData {
  stats: DashboardStats;
  weekly: number[];
}

export async function getOverview(): Promise<OverviewData> {
  if (DEMO_MODE) {
    return { stats: mock.mockStats, weekly: mock.mockWeeklyVolume };
  }
  const org = await getCurrentOrg();
  const supabase = await createClient();
  const empty: DashboardStats = {
    questionsAnswered: 0,
    questionsThisWeek: 0,
    deflectionRate: 0,
    openEscalations: 0,
    activeEmployees: 0,
    hoursSaved: 0,
  };
  if (!org || !supabase) return { stats: empty, weekly: Array(8).fill(0) };

  const eightWeeksAgo = new Date(
    Date.now() - 8 * 7 * 24 * 60 * 60 * 1000
  ).toISOString();

  const [{ data: qs }, { count: openCount }] = await Promise.all([
    supabase
      .from("questions")
      .select("asked_at, was_escalated")
      .eq("org_id", org.id)
      .gte("asked_at", eightWeeksAgo),
    supabase
      .from("escalations")
      .select("id", { count: "exact", head: true })
      .eq("org_id", org.id)
      .eq("status", "open"),
  ]);

  const rows = qs ?? [];
  const weekly = bucketByWeek(rows.map((r) => r.asked_at));
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const questionsThisWeek = rows.filter(
    (r) => new Date(r.asked_at).getTime() >= oneWeekAgo
  ).length;
  const answered = rows.filter((r) => !r.was_escalated).length;

  const stats: DashboardStats = {
    questionsAnswered: answered,
    questionsThisWeek,
    deflectionRate: rows.length ? answered / rows.length : 0,
    openEscalations: openCount ?? 0,
    activeEmployees: 0,
    hoursSaved: Math.round((answered * 3) / 60), // ~3 min saved per answer
  };

  return { stats, weekly };
}

/** Bucket ISO timestamps into 8 weekly counts, oldest → newest. */
function bucketByWeek(timestamps: string[]): number[] {
  const buckets = Array(8).fill(0);
  const now = Date.now();
  const week = 7 * 24 * 60 * 60 * 1000;
  for (const ts of timestamps) {
    const age = now - new Date(ts).getTime();
    const idx = 7 - Math.floor(age / week);
    if (idx >= 0 && idx < 8) buckets[idx]++;
  }
  return buckets;
}
