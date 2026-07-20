import { Check, Sparkles, Info, Receipt } from "lucide-react";
import { BETA_FEATURES } from "@/lib/config";
import { Panel, EmptyState } from "@/components/dashboard/ui";

export function BillingClient() {
  return (
    <>
      {/* current plan banner */}
      <Panel className="!bg-gradient-to-br !from-brand-600 !to-brand-800 !border-brand-500/40 text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-200" />
              <p className="text-sm text-brand-100">Current plan</p>
            </div>
            <p className="mt-1 text-2xl font-bold">Free · Beta</p>
            <p className="mt-1 text-sm text-brand-100">
              Every feature included · no credit card required
            </p>
          </div>
          <span className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium">
            Beta
          </span>
        </div>
      </Panel>

      {/* what's included */}
      <Panel className="mt-6">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-brand-600" />
          <h2 className="font-semibold">What&apos;s included</h2>
        </div>
        <p className="mt-1 text-sm text-muted">
          Policy Expert is free while we&apos;re in beta. When we introduce paid
          plans you&apos;ll get plenty of notice — and early-adopter pricing for
          sticking with us.
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {BETA_FEATURES.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
              <span className="text-muted">{f}</span>
            </li>
          ))}
        </ul>
      </Panel>

      {/* invoices */}
      <Panel className="mt-6">
        <h2 className="font-semibold">Billing history</h2>
        <div className="mt-3">
          <EmptyState
            icon={<Receipt className="h-6 w-6" />}
            title="Nothing to bill during beta"
            description="No charges while Policy Expert is free. Invoices will show up here if you move to a paid plan later."
          />
        </div>
      </Panel>
    </>
  );
}
