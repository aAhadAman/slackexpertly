"use client";

import { useState } from "react";
import { Save, Trash2 } from "lucide-react";
import { Panel } from "@/components/dashboard/ui";
import { Button } from "@/components/ui/button";

export function SettingsClient({
  org,
  email,
}: {
  org: string;
  email: string;
}) {
  const [saved, setSaved] = useState(false);
  const [tone, setTone] = useState("friendly");

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Organization */}
      <Panel>
        <h2 className="font-semibold">Organization</h2>
        <p className="text-sm text-muted">Basic details about your workspace.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Company name" defaultValue={org} />
          <Field label="Admin email" defaultValue={email} type="email" />
        </div>
      </Panel>

      {/* Bot persona */}
      <Panel>
        <h2 className="font-semibold">Bot persona</h2>
        <p className="text-sm text-muted">
          How your bot introduces itself and the tone it answers in.
        </p>
        <div className="mt-5 space-y-4">
          <Field label="Bot display name" defaultValue="Policy Expert" />
          <div>
            <label className="mb-1.5 block text-sm font-medium">Tone</label>
            <div className="flex flex-wrap gap-2">
              {["friendly", "professional", "concise"].map((t) => (
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
              defaultValue="I'm not fully sure about that one — I've passed it to our HR team and they'll get back to you shortly."
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
        <Button onClick={save}>
          <Save className="h-4 w-4" /> Save changes
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
  defaultValue,
  type = "text",
}: {
  label: string;
  defaultValue?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      <input
        type={type}
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
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
