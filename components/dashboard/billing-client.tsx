"use client";

import { useState } from "react";
import { Check, CreditCard, Download, Sparkles } from "lucide-react";
import { PLANS, type PlanId } from "@/lib/config";
import { Panel } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INVOICES = [
  { id: "INV-0007", date: "Jul 1, 2026", amount: "$99.00", status: "Paid" },
  { id: "INV-0006", date: "Jun 1, 2026", amount: "$99.00", status: "Paid" },
  { id: "INV-0005", date: "May 1, 2026", amount: "$99.00", status: "Paid" },
];

export function BillingClient() {
  const [current, setCurrent] = useState<PlanId>("team");
  const [notice, setNotice] = useState<string | null>(null);

  function choose(id: PlanId) {
    if (id === current) return;
    setCurrent(id);
    setNotice(
      `Plan change to ${PLANS.find((p) => p.id === id)?.name} will be handled by Stripe Checkout once billing is connected.`
    );
  }

  const plan = PLANS.find((p) => p.id === current)!;

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
              {plan.seats} · Trial ends in 11 days
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium">
              Free trial
            </span>
          </div>
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
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-2">
                <th className="py-2 pr-4 font-medium">Invoice</th>
                <th className="py-2 pr-4 font-medium">Date</th>
                <th className="py-2 pr-4 font-medium">Amount</th>
                <th className="py-2 pr-4 font-medium">Status</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 font-medium">{inv.id}</td>
                  <td className="py-3 pr-4 text-muted">{inv.date}</td>
                  <td className="py-3 pr-4">{inv.amount}</td>
                  <td className="py-3 pr-4">
                    <Badge tone="success">{inv.status}</Badge>
                  </td>
                  <td className="py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-muted hover:text-foreground">
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}
