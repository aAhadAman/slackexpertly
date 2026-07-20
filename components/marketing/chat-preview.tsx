import { FileText, Sparkles } from "lucide-react";

/** Static Slack-style preview of the bot answering with citations. */
export function ChatPreview() {
  return (
    <div className="card overflow-hidden shadow-2xl shadow-brand-900/10">
      {/* window chrome */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-2 text-xs font-medium text-muted">
          #ask-hr · Slack
        </span>
      </div>

      <div className="space-y-5 p-5">
        {/* employee question */}
        <div className="flex gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-slate-400 to-slate-600 text-xs font-semibold text-white">
            PS
          </div>
          <div>
            <p className="text-xs">
              <span className="font-semibold">Priya S.</span>{" "}
              <span className="text-muted-2">9:41 AM</span>
            </p>
            <p className="mt-1 text-sm">
              How much is my deductible on the PPO plan?
            </p>
          </div>
        </div>

        {/* bot answer */}
        <div className="flex gap-3">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-xs">
              <span className="font-semibold">Policy Expert</span>{" "}
              <span className="rounded bg-surface-2 px-1 py-0.5 text-[10px] font-medium text-muted">
                APP
              </span>{" "}
              <span className="text-muted-2">9:41 AM</span>
            </p>
            <div className="mt-1 rounded-lg rounded-tl-none border border-border bg-surface-2/60 p-3 text-sm leading-relaxed">
              Your in-network deductible on the{" "}
              <strong>Aetna PPO</strong> is{" "}
              <strong>$1,500</strong> individual / <strong>$3,000</strong>{" "}
              family. Preventive care is covered 100% and doesn&apos;t count
              toward it.
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Cite doc="Aetna PPO.pdf" page={4} />
                <Cite doc="Benefits Guide.pdf" page={11} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Cite({ doc, page }: { doc: string; page: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
      <FileText className="h-3 w-3" />
      {doc} · p.{page}
    </span>
  );
}
