"use client";

import { useState, useTransition } from "react";
import { Save, Trash2, Loader2 } from "lucide-react";
import { DEMO_MODE } from "@/lib/config";
import { saveOrgProfile, saveBotSettings } from "@/app/actions/data";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";

type Tone = "friendly" | "professional" | "concise";

export function SettingsClient({
  org,
  email,
  botName,
  botTone,
  fallbackMessage,
}: {
  org: string;
  email: string;
  botName: string;
  botTone: Tone;
  fallbackMessage: string;
}) {
  const [name, setName] = useState(org);
  const [bName, setBName] = useState(botName);
  const [tone, setTone] = useState<Tone>(botTone);
  const [fallback, setFallback] = useState(fallbackMessage);
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function save() {
    if (DEMO_MODE) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    startTransition(async () => {
      await Promise.all([
        saveOrgProfile(name),
        saveBotSettings({
          bot_name: bName,
          bot_tone: tone,
          fallback_message: fallback,
        }),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <div className="space-y-6">
      {/* Organization */}
      <Panel>
        <h2 className="font-semibold">Organization</h2>
        <p className="text-sm text-muted">Basic details about your workspace.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="Company name"
            value={name}
            onChange={setName}
          />
          <Field label="Admin email" value={email} type="email" readOnly />
        </div>
      </Panel>

      {/* Bot persona */}
      <Panel>
        <h2 className="font-semibold">Bot persona</h2>
        <p className="text-sm text-muted">
          How your bot introduces itself and the tone it answers in.
        </p>
        <div className="mt-5 space-y-4">
          <Field label="Bot display name" value={bName} onChange={setBName} />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Tone</label>
            <div className="flex flex-wrap gap-2">
              {(["friendly", "professional", "concise"] as Tone[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={
                    "rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors " +
                    (tone === t
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                      : "border-border text-muted hover:text-foreground")
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Fallback message
            </label>
            <textarea
              rows={2}
              value={fallback}
              onChange={(e) => setFallback(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>
      </Panel>

      {/* Notifications */}
      <Panel>
        <h2 className="font-semibold">Notifications</h2>
        <p className="text-sm text-muted">When should we email you?</p>
        <div className="mt-4 space-y-1">
          <Toggle label="New escalation waiting" defaultChecked />
          <Toggle label="Weekly usage digest" defaultChecked />
          <Toggle label="Document indexing finished" />
          <Toggle label="Product updates" />
        </div>
      </Panel>

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={pending}>
          {pending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}{" "}
          Save changes
        </Button>
        {saved && (
          <span className="text-sm text-emerald-600 dark:text-emerald-400">
            Saved!
          </span>
        )}
      </div>

      {/* Danger zone */}
      <Panel className="!border-red-200 dark:!border-red-500/30">
        <h2 className="font-semibold text-red-600 dark:text-red-400">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-muted">
          Permanently delete your workspace, documents, and bot. This can&apos;t
          be undone.
        </p>
        <Button variant="danger" size="sm" className="mt-4">
          <Trash2 className="h-4 w-4" /> Delete workspace
        </Button>
      </Panel>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className={
          "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 " +
          (readOnly ? "text-muted" : "")
        }
      />
    </div>
  );
}

function Toggle({
  label,
  defaultChecked,
}: {
  label: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <label className="flex cursor-pointer items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <button
        type="button"
        onClick={() => setOn((o) => !o)}
        className={
          "relative h-6 w-11 rounded-full transition-colors " +
          (on ? "bg-brand-600" : "bg-surface-2 border border-border")
        }
        aria-pressed={on}
      >
        <span
          className={
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform " +
            (on ? "left-0.5 translate-x-5" : "left-0.5")
          }
        />
      </button>
    </label>
  );
}
