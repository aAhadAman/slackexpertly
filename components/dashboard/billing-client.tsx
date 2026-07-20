"use client";

import { useState } from "react";
import { Check, CreditCard, Receipt, Sparkles } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/config";
import { Panel, EmptyState } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function trialDaysLeft(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

export function BillingClient({
  currentPlan,
  status,
  trialEndsAt,
}: {
  currentPlan: PlanId;
  status: string;
  trialEndsAt: string | null;
}) {
  const [current, setCurrent] = useState<PlanId>(currentPlan);
  const [notice, setNotice] = useState<string | null>(null);

  function choose(id: PlanId) {
    if (id === current) return;
    setCurrent(id);
    setNotice(
      `Plan change to ${PLANS.find((p) => p.id === id)?.name} will be completed via Stripe Checkout once billing is connected.`
    );
  }

  const plan = PLANS.find((p) => p.id === current)!;
  const daysLeft = trialDaysLeft(trialEndsAt);

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
            <p className="mt-1 text-2xl font-bold">
              {plan.name} · ${plan.price}/mo
            </p>
            <p className="mt-1 text-sm text-brand-100">
              {plan.seats}
              {status === "trialing" && daysLeft !== null
                ? ` · Trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`
                : ""}
            </p>
          </div>
          <span className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium capitalize">
            {status === "trialing" ? "Free trial" : status}
          </span>
        </div>
      </Panel>

      {notice && (
        <div className="mt-4 rounded-lg border border-dashed border-brand-300 bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300">
          {notice}
        </div>
      )}

      {/* plans */}
      <h2 className="mt-8 font-semibold">Change plan</h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-3">
        {PLANS.map((p) => {
          const active = p.id === current;
          return (
            <div
              key={p.id}
              className={cn(
                "flex flex-col rounded-2xl border p-5",
                active
                  ? "border-brand-500 bg-surface ring-1 ring-brand-500"
                  : "border-border bg-surface"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{p.name}</h3>
                {active && <Badge tone="brand">Current</Badge>}
              </div>
              <p className="mt-1 text-sm text-muted">{p.seats}</p>
              <p className="mt-3 text-2xl font-bold">
                ${p.price}
                <span className="text-sm font-normal text-muted">/mo</span>
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                variant={active ? "secondary" : "primary"}
                size="sm"
                className="mt-5 w-full"
                disabled={active}
                onClick={() => choose(p.id)}
              >
                {active ? "Current plan" : `Switch to ${p.name}`}
              </Button>
            </div>
          );
        })}
      </div>

      {/* payment method */}
      <Panel className="mt-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-surface-2 text-muted">
              <CreditCard className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium">No payment method on file</p>
              <p className="text-xs text-muted">
                Add a card before your trial ends to keep the bot running.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Add card
          </Button>
        </div>
      </Panel>

      {/* invoices */}
      <Panel className="mt-6">
        <h2 className="font-semibold">Billing history</h2>
        <div className="mt-3">
          <EmptyState
            icon={<Receipt className="h-6 w-6" />}
            title="No invoices yet"
            description="Invoices will appear here once your subscription starts through Stripe."
          />
        </div>
      </Panel>
    </>
  );
}
