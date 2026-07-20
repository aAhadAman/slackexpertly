import { Check } from "lucide-react";
import { PLANS } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.id}
          className={cn(
            "relative flex flex-col rounded-2xl border p-6",
            plan.highlight
              ? "border-brand-500 bg-surface shadow-xl shadow-brand-600/10 lg:-my-3 lg:py-9"
              : "border-border bg-surface"
          )}
        >
          {plan.highlight && (
            <span className="absolute -top-3 left-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow">
              Most popular
            </span>
          )}
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <p className="mt-1 text-sm text-muted">{plan.seats}</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-bold tracking-tight">
              ${plan.price}
            </span>
            <span className="text-sm text-muted">/month</span>
          </div>

          <ButtonLink
            href="/signup"
            variant={plan.highlight ? "primary" : "outline"}
            className="mt-6 w-full"
          >
            Start free trial
          </ButtonLink>

          <ul className="mt-6 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                <span className="text-muted">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
