"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Hash, Users, Sliders, Loader2 } from "lucide-react";
import type { Integration } from "@/lib/types";
import { DEMO_MODE } from "@/lib/config";
import { toggleIntegration, saveBotSettings } from "@/app/actions/data";
import { Panel } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CANDIDATE_CHANNELS = [
  "#ask-hr",
  "#benefits",
  "#general",
  "Direct messages",
];

export function IntegrationsClient({
  initial,
  threshold: initialThreshold,
  channels: activeChannels,
}: {
  initial: Integration[];
  threshold: number;
  channels: string[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<Integration[]>(initial);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [channels, setChannels] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      CANDIDATE_CHANNELS.map((c) => [c, activeChannels.includes(c)])
    )
  );
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setItems(initial);
  }, [initial]);

  function toggle(id: Integration["id"]) {
    const target = items.find((x) => x.id === id);
    const next = !target?.connected;
    setItems((it) =>
      it.map((x) =>
        x.id === id
          ? {
              ...x,
              connected: next,
              workspace: next
                ? id === "slack"
                  ? "your-workspace.slack.com"
                  : "Your org (Teams)"
                : undefined,
            }
          : x
      )
    );
    if (!DEMO_MODE) {
      startTransition(async () => {
        await toggleIntegration(id, next);
        router.refresh();
      });
    }
  }

  function save() {
    const active = CANDIDATE_CHANNELS.filter((c) => channels[c]);
    if (DEMO_MODE) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    startTransition(async () => {
      await saveBotSettings({
        confidence_threshold: threshold,
        active_channels: active,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((it) => (
          <Panel key={it.id}>
            <div className="flex items-start justify-between">
              <span
                className={cn(
                  "grid h-12 w-12 place-items-center rounded-xl",
                  it.id === "slack"
                    ? "bg-[#4A154B]/10 text-[#4A154B] dark:text-[#e8a5e8]"
                    : "bg-[#5059C9]/10 text-[#5059C9] dark:text-[#a9b0f5]"
                )}
              >
                {it.id === "slack" ? (
                  <Hash className="h-6 w-6" />
                ) : (
                  <Users className="h-6 w-6" />
                )}
              </span>
              {it.connected ? (
                <Badge tone="success">
                  <Check className="h-3 w-3" /> Connected
                </Badge>
              ) : (
                <Badge tone="neutral">Not connected</Badge>
              )}
            </div>
            <h3 className="mt-4 font-semibold">{it.name}</h3>
            <p className="mt-1 text-sm text-muted">
              {it.connected
                ? `Workspace: ${it.workspace}`
                : `Add the bot to your ${it.name} workspace in one click.`}
            </p>
            <div className="mt-4">
              {it.connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggle(it.id)}
                >
                  Disconnect
                </Button>
              ) : (
                <Button size="sm" onClick={() => toggle(it.id)}>
                  Connect {it.name}
                </Button>
              )}
            </div>
          </Panel>
        ))}
      </div>

      {/* Bot behavior */}
      <Panel className="mt-6">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-brand-600" />
          <h2 className="font-semibold">Bot behavior</h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Control where the bot listens and how confident it must be before it
          answers.
        </p>

        <div className="mt-5">
          <label className="text-sm font-medium">Active channels</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {CANDIDATE_CHANNELS.map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2"
              >
                <input
                  type="checkbox"
                  checked={!!channels[c]}
                  onChange={() =>
                    setChannels((s) => ({ ...s, [c]: !s[c] }))
                  }
                  className="h-4 w-4 accent-brand-600"
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
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
          <p className="mt-1.5 text-xs text-muted">
            Below this confidence, the bot escalates to you instead of answering.
            Higher = safer, more escalations.
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
          <Button size="sm" onClick={save} disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save
            settings
          </Button>
          {saved && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400">
              Saved!
            </span>
          )}
        </div>
      </Panel>
    </>
  );
}
