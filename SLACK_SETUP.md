# Slack bot setup

The Slack bot code is built. To make it run you need to (1) create a Slack app,
(2) drop its credentials into `.env.local`, and (3) give Slack a public URL to
reach your app. This guide walks through it.

> **No-AI phase:** right now the bot files every question into your dashboard's
> **Escalations** inbox and replies "passed to HR." When we add RAG later, it
> will answer directly and only escalate the hard ones — same setup.

## Prerequisites

1. **Run the database migration** (`supabase/migrations/0001_init.sql`) in the
   Supabase SQL Editor. Nothing persists without it.
2. **Add your Supabase service-role key** to `.env.local` as
   `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → `service_role`, secret).
   The Slack webhook has no user session, so it needs this to write.

## 1. Get a public URL

Slack must reach your app over HTTPS — `localhost` won't work directly.

- **Local testing:** run a tunnel to port 3000, e.g.
  `npx cloudflared tunnel --url http://localhost:3000`
  (or `ngrok http 3000`). Copy the `https://…` URL it prints.
- **Or deploy** to Vercel and use that URL.

Set it in `.env.local`:

```
NEXT_PUBLIC_APP_URL=https://your-public-url
```

## 2. Create the Slack app (from manifest)

1. Go to https://api.slack.com/apps → **Create New App** → **From a manifest**.
2. Pick your workspace, choose **YAML**, and paste the manifest below —
   **replace every `YOUR_PUBLIC_URL`** with the host from step 1 (no trailing slash).

```yaml
display_information:
  name: Policy Expert
  description: Instant, cited answers to HR & benefits questions.
features:
  bot_user:
    display_name: Policy Expert
    always_online: true
  slash_commands:
    - command: /askhr
      url: https://YOUR_PUBLIC_URL/api/slack/command
      description: Ask an HR or benefits question
      usage_hint: how much is my PPO deductible?
      should_escape: false
oauth_config:
  redirect_urls:
    - https://YOUR_PUBLIC_URL/api/slack/oauth
  scopes:
    bot:
      - commands
      - chat:write
      - im:history
      - im:write
      - users:read
settings:
  event_subscriptions:
    request_url: https://YOUR_PUBLIC_URL/api/slack/events
    bot_events:
      - message.im
  interactivity:
    is_enabled: false
  org_deploy_enabled: false
  socket_mode_enabled: false
  token_rotation_enabled: false
```

3. Create the app. When Slack saves the Events `request_url`, your dev server
   must already be running behind the tunnel so its `url_verification` check
   passes (green tick).

## 3. Copy credentials into `.env.local`

From the app's **Basic Information** page:

```
SLACK_CLIENT_ID=...          # "App Credentials" → Client ID
SLACK_CLIENT_SECRET=...      # "App Credentials" → Client Secret
SLACK_SIGNING_SECRET=...     # "App Credentials" → Signing Secret
SLACK_SLASH_COMMAND=/askhr
```

Restart `npm run dev` after editing `.env.local`.

## 4. Connect from the dashboard

1. Open **Dashboard → Integrations** and click **Add to Slack**.
2. Approve the install in your workspace. You'll bounce back with
   "Slack connected."

## 5. Test it

- **DM the bot:** open the Policy Expert app in Slack and send it a question.
- **Slash command:** type `/askhr what's my dental coverage?` in any channel —
  only you see the reply.

Either way, the question should appear in **Dashboard → Escalations** within a
few seconds, and the employee gets the "passed to HR" confirmation.

## Troubleshooting

| Symptom | Fix |
| :--- | :--- |
| Events URL won't verify | Dev server + tunnel must be running; URL must be exactly `.../api/slack/events`. |
| "invalid signature" (401) | `SLACK_SIGNING_SECRET` is wrong or missing; restart after setting it. |
| Connected but nothing in Escalations | Check `SUPABASE_SERVICE_ROLE_KEY` is set and the migration ran. |
| Bot replies to itself in a loop | Handled — we ignore bot messages — but make sure only `message.im` is subscribed. |
