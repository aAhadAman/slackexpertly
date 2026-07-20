/**
 * Central config + "demo mode" detection.
 *
 * The app is fully runnable before any backend exists. When the Supabase env
 * vars are absent we fall back to DEMO_MODE: auth is simulated with a cookie
 * and all data is served from lib/mock.ts. Once you add the env vars in
 * .env.local (see .env.example), the real Supabase client takes over.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const DEMO_MODE = !SUPABASE_URL || !SUPABASE_ANON_KEY;

export const APP_NAME = "The Policy Expert";

/** While in beta the product is free. Flip to false when paid plans launch. */
export const BETA = true;

/** Everything included during the free beta — shown on pricing + billing. */
export const BETA_FEATURES = [
  "Slack workspace connection",
  "Unlimited policy documents",
  "AI answers cited to your documents",
  "HR escalation inbox",
  "Usage analytics",
  "Custom bot persona & tone",
];

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    seats: "Up to 50 employees",
    highlight: false,
    features: [
      "1 Slack or Teams workspace",
      "Up to 25 policy documents",
      "Cited answers with page numbers",
      "HR escalation inbox",
      "Email support",
    ],
  },
  {
    id: "team",
    name: "Team",
    price: 99,
    seats: "Up to 250 employees",
    highlight: true,
    features: [
      "Slack + Teams workspaces",
      "Unlimited policy documents",
      "Cited answers with page numbers",
      "HR escalation inbox + analytics",
      "Custom bot persona & tone",
      "Priority support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    seats: "Up to 500 employees",
    highlight: false,
    features: [
      "Everything in Team",
      "Multiple workspaces",
      "SSO & audit log",
      "Usage reporting exports",
      "Dedicated onboarding",
    ],
  },
] as const;

export type PlanId = (typeof PLANS)[number]["id"];
