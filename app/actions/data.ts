"use server";

import { revalidatePath } from "next/cache";
import { DEMO_MODE } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getCurrentOrg } from "@/lib/data";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const DEMO_OK: ActionResult = { ok: true };

function categoryFor(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("401") || n.includes("retire")) return "Retirement";
  if (n.includes("dental") || n.includes("medical") || n.includes("insur"))
    return "Insurance";
  if (n.includes("handbook") || n.includes("policy")) return "Policy";
  if (n.includes("benefit")) return "Benefits";
  return "Other";
}

/** Upload a PDF to Storage and record it in the documents table. */
export async function uploadDocument(formData: FormData): Promise<ActionResult> {
  if (DEMO_MODE) return DEMO_OK;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "No file provided." };
  }
  if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
    return { ok: false, error: "Only PDF files are supported." };
  }

  const org = await getCurrentOrg();
  const supabase = await createClient();
  if (!org || !supabase) return { ok: false, error: "Not signed in." };

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${org.id}/${crypto.randomUUID()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: "application/pdf", upsert: false });
  if (upErr) return { ok: false, error: upErr.message };

  // Indexing (pages/chunks/embeddings) is filled in later by the ingestion
  // backend; we record the file as ready so it's answerable in the UI.
  const { error: insErr } = await supabase.from("documents").insert({
    org_id: org.id,
    name: file.name,
    category: categoryFor(file.name),
    size_bytes: file.size,
    status: "ready",
    storage_path: path,
    uploaded_by: (await supabase.auth.getUser()).data.user?.id ?? null,
  });
  if (insErr) {
    await supabase.storage.from("documents").remove([path]);
    return { ok: false, error: insErr.message };
  }

  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteDocument(
  id: string,
  storagePath: string | null
): Promise<ActionResult> {
  if (DEMO_MODE) return DEMO_OK;
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Not signed in." };

  if (storagePath) {
    await supabase.storage.from("documents").remove([storagePath]);
  }
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function setEscalationStatus(
  id: string,
  status: "open" | "answered" | "dismissed",
  answer?: string
): Promise<ActionResult> {
  if (DEMO_MODE) return DEMO_OK;
  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("escalations")
    .update({ status, ...(answer !== undefined ? { answer } : {}) })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/escalations");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function toggleIntegration(
  provider: "slack" | "teams",
  connect: boolean
): Promise<ActionResult> {
  if (DEMO_MODE) return DEMO_OK;
  const org = await getCurrentOrg();
  const supabase = await createClient();
  if (!org || !supabase) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("integrations").upsert(
    {
      org_id: org.id,
      provider,
      connected: connect,
      workspace: connect
        ? provider === "slack"
          ? "your-workspace.slack.com"
          : "Your org (Teams)"
        : null,
      connected_at: connect ? new Date().toISOString() : null,
    },
    { onConflict: "org_id,provider" }
  );
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/integrations");
  return { ok: true };
}

export async function saveBotSettings(input: {
  confidence_threshold?: number;
  active_channels?: string[];
  bot_name?: string;
  bot_tone?: "friendly" | "professional" | "concise";
  fallback_message?: string;
}): Promise<ActionResult> {
  if (DEMO_MODE) return DEMO_OK;
  const org = await getCurrentOrg();
  const supabase = await createClient();
  if (!org || !supabase) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("organizations")
    .update(input)
    .eq("id", org.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/integrations");
  revalidatePath("/dashboard/settings");
  return { ok: true };
}

export async function saveOrgProfile(name: string): Promise<ActionResult> {
  if (DEMO_MODE) return DEMO_OK;
  const org = await getCurrentOrg();
  const supabase = await createClient();
  if (!org || !supabase) return { ok: false, error: "Not signed in." };

  const { error } = await supabase
    .from("organizations")
    .update({ name })
    .eq("id", org.id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
