"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Hash,
  Users,
  Sliders,
  Loader2,
  MessageCircle,
  SlashSquare,
  AtSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Integration } from "@/lib/types";
import { DEMO_MODE } from "@/lib/config";
import { toggleIntegration, saveBotSettings } from "@/app/actions/data";
import { Panel } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IntegrationsClient({
  initial,
  threshold: initialThreshold,
  installUrl,
  slackConfigured,
  slashCommand,
  statusParam,
}: {
  initial: Integration[];
  threshold: number;
  installUrl: string | null;
  slackConfigured: boolean;
  slashCommand: string;
  statusParam: string | null;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Integration[]>(initial);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => setItems(initial), [initial]);

  const slack = items.find((i) => i.id === "slack");
  const banner = statusBanner(statusParam);

  function disconnectSlack() {
    setItems((it) =>
      it.map((x) =>
        x.id === "slack" ? { ...x, connected: false, workspace: undefined } : x
      )
    );
    if (!DEMO_MODE) {
      startTransition(async () => {
        await toggleIntegration("slack", false);
        router.refresh();
      });
    }
  }

  function connectSlack() {
    if (DEMO_MODE) {
      setItems((it) =>
        it.map((x) =>
          x.id === "slack"
            ? { ...x, connected: true, workspace: "demo.slack.com" }
            : x
        )
      );
      return;
    }
    if (installUrl) window.location.href = installUrl;
  }

  function saveThreshold() {
    if (DEMO_MODE) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    startTransition(async () => {
      await saveBotSettings({ confidence_threshold: threshold });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <>
      {banner && (
        <div
          className={cn(
            "mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
            banner.ok
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300"
          )}
        >
          {banner.ok ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertCircle className="h-4 w-4" />
          )}
          {banner.text}
        </div>
      )}

      {/* Slack */}
      <Panel>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#4A154B]/10 text-[#4A154B] dark:text-[#e8a5e8]">
              <Hash className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold">Slack</h3>
              <p className="text-sm text-muted">
                {slack?.connected
                  ? `Connected to ${slack.workspace}`
                  : "Add the bot to your Slack workspace."}
              </p>
            </div>
          </div>
          {slack?.connected ? (
            <Badge tone="success">
              <Check className="h-3 w-3" /> Connected
            </Badge>
          ) : (
            <Badge tone="neutral">Not connected</Badge>
          )}
        </div>

        {!slackConfigured && !DEMO_MODE && (
          <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            Slack app credentials aren&apos;t set yet. Add SLACK_CLIENT_ID,
            SLACK_CLIENT_SECRET and SLACK_SIGNING_SECRET to enable the connect
            button.
          </p>
        )}

        <div className="mt-4">
          {slack?.connected ? (
            <Button variant="outline" size="sm" onClick={disconnectSlack}>
              Disconnect
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={connectSlack}
              disabled={!DEMO_MODE && !installUrl}
            >
              Add to Slack
            </Button>
          )}
        </div>
      </Panel>

      {/* How employees reach the bot */}
      <Panel className="mt-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-brand-600" />
          <h2 className="font-semibold">How employees reach the bot</h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Answers stay private to the person asking — the way benefits questions
          should be.
        </p>

        <div className="mt-4 space-y-3">
          <AccessRow
            icon={<MessageCircle className="h-5 w-5" />}
            title="Direct message"
            body="Employees DM the bot for a fully private, 1:1 conversation."
            status="on"
          />
          <AccessRow
            icon={<SlashSquare className="h-5 w-5" />}
            title={`Slash command · ${slashCommand}`}
            body="Type the command anywhere; the reply is ephemeral — only the asker sees it."
            status="on"
          />
          <AccessRow
            icon={<AtSign className="h-5 w-5" />}
            title="@mentions in channels"
            body="Let employees ask in shared channels with public answers."
            status="soon"
          />
        </div>
      </Panel>

      {/* Confidence threshold (applies once AI answering is enabled) */}
      <Panel className="mt-6">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-brand-600" />
          <h2 className="font-semibold">Answering confidence</h2>
          <Badge tone="neutral">Used when AI answering is on</Badge>
        </div>
        <p className="mt-1 text-sm text-muted">
          Right now every question is routed to your Escalations inbox. Once AI
          answering is enabled, the bot will answer directly above this
          confidence and escalate below it.
        </p>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Confidence threshold</label>
            <span className="text-sm font-semibold text-brand-600">
              {threshold}%
            </span>
          </div>
          <input
            type="range"
            min={40}
            max={95}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            className="mt-2 w-full accent-brand-600"
          />
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
          <Button size="sm" onClick={saveThreshold} disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save
          </Button>
          {saved && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Saved!
            </span>
          )}
        </div>
      </Panel>

      {/* Teams (coming soon) */}
      <Panel className="mt-6 opacity-70">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#5059C9]/10 text-[#5059C9] dark:text-[#a9b0f5]">
              <Users className="h-6 w-6" />
            </span>
            <div>
              <h3 className="font-semibold">Microsoft Teams</h3>
              <p className="text-sm text-muted">Same bot, for Teams workspaces.</p>
            </div>
          </div>
          <Badge tone="neutral">Coming soon</Badge>
        </div>
      </Panel>
    </>
  );
}

function statusBanner(
  param: string | null
): { ok: boolean; text: string } | null {
  switch (param) {
    case "connected":
      return { ok: true, text: "Slack connected — your bot is live." };
    case "denied":
      return { ok: false, text: "Slack connection was cancelled." };
    case "unauthorized":
      return {
        ok: false,
        text: "Couldn't verify your workspace. Please try connecting again.",
      };
    case "error":
      return { ok: false, text: "Something went wrong connecting Slack." };
    default:
      return null;
  }
}

function AccessRow({
  icon,
  title,
  body,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  status: "on" | "soon";
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-muted">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted">{body}</p>
      </div>
      {status === "on" ? (
        <Badge tone="success">Active</Badge>
      ) : (
        <Badge tone="neutral">Soon</Badge>
      )}
    </div>
  );
}
