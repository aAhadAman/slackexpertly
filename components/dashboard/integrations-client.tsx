"use client";

import { useState } from "react";
import { Check, Hash, Users, Sliders } from "lucide-react";
import type { Integration } from "@/lib/types";
import { Panel } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function IntegrationsClient({ initial }: { initial: Integration[] }) {
  const [items, setItems] = useState<Integration[]>(initial);
  const [threshold, setThreshold] = useState(70);
  const [channels, setChannels] = useState<Record<string, boolean>>({
    "#ask-hr": true,
    "#benefits": true,
    "#general": false,
    "Direct messages": true,
  });

  function toggle(id: Integration["id"]) {
    setItems((it) =>
      it.map((x) =>
        x.id === id
          ? {
              ...x,
              connected: !x.connected,
              workspace: !x.connected
                ? id === "slack"
                  ? "northwind.slack.com"
                  : "Northwind (Teams)"
                : undefined,
              connectedAt: !x.connected ? new Date().toISOString() : undefined,
            }
          : x
      )
    );
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
            {Object.keys(channels).map((c) => (
              <label
                key={c}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border px-3 py-2 text-sm hover:bg-surface-2"
              >
                <input
                  type="checkbox"
                  checked={channels[c]}
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
            <label className="text-sm font-medium">
              Confidence threshold
            </label>
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

        <div className="mt-6 border-t border-border pt-4">
          <Button size="sm">Save settings</Button>
        </div>
      </Panel>
    </>
  );
}
