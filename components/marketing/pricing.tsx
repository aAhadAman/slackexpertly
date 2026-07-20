import { Check, Sparkles } from "lucide-react";
import { BETA_FEATURES } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";

export function Pricing() {
  return (
    <div className="mx-auto max-w-lg">
      <div className="relative flex flex-col rounded-2xl border border-brand-500 bg-surface p-8 shadow-xl shadow-brand-600/10">
        <span className="absolute -top-3 left-8 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow">
          Beta
        </span>

        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-600" />
          <h3 className="text-lg font-semibold">Free while in beta</h3>
        </div>
        <p className="mt-2 text-sm text-muted">
          Every feature, no cost, no credit card. Help us shape the product —
          and lock in early-adopter pricing when we launch paid plans.
        </p>

        <div className="mt-5 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight">$0</span>
          <span className="text-sm text-muted">/month during beta</span>
        </div>

        <ButtonLink href="/signup" size="lg" className="mt-6 w-full">
          Start free
        </ButtonLink>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {BETA_FEATURES.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
              <span className="text-muted">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
