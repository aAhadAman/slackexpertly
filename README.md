# The Policy Expert — Frontend

The HR-manager dashboard for **The Policy Expert**: a self-serve AI benefits bot
for Slack/Teams. Upload policy PDFs, connect a workspace, and give employees
instant, cited answers. Built with **Next.js 16 (App Router) + TypeScript +
Tailwind v4**.

## What's inside

| Route | Purpose |
| :--- | :--- |
| `/` | Marketing landing page (hero, how-it-works, features, pricing, FAQ) |
| `/login`, `/signup` | Auth screens (Supabase Auth, or simulated in demo mode) |
| `/dashboard` | Overview: usage stats, weekly volume chart, setup checklist, escalations |
| `/dashboard/documents` | Drag-and-drop PDF upload + document management |
| `/dashboard/playground` | "Test the bot" chat — mirrors the Slack/Teams experience |
| `/dashboard/escalations` | Inbox of low-confidence questions routed to HR |
| `/dashboard/integrations` | Connect Slack/Teams, choose channels, set confidence threshold |
| `/dashboard/billing` | Plan management + invoices (wired to Stripe later) |
| `/dashboard/settings` | Org, bot persona/tone, notifications |

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
```

### Demo mode (default)

With no Supabase env vars set, the app runs in **demo mode**:
- Any email + a 6-character password signs you in.
- All data (documents, escalations, analytics) comes from `lib/mock.ts`.
- Uploads and chat are simulated on the client so you can click through everything.

This lets you (and prospects) explore the whole product before any backend exists.

### Going live

Copy `.env.example` → `.env.local` and fill in the Supabase (and later Stripe /
OpenAI) values. As soon as `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_ANON_KEY` are present, real Supabase Auth takes over
automatically — no code changes needed.

## Architecture notes

- **Auth abstraction** lives in `lib/auth.ts` + `app/actions/auth.ts` and works
  in both demo and Supabase modes behind one interface.
- **Supabase clients**: `lib/supabase/client.ts` (browser) and `server.ts`
  (server components/actions); both return `null` in demo mode.
- **`proxy.ts`** refreshes the Supabase session (no-op in demo mode).
- The Q&A/RAG itself runs in the **N8N + OpenAI + Supabase vector** backend
  (not part of this repo yet). The `playground` uses a canned responder that you
  later point at your real endpoint.
