import {
  Upload,
  Plug,
  MessagesSquare,
  Quote,
  Clock,
  ShieldCheck,
  Inbox,
  BarChart3,
  Zap,
  Lock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { ChatPreview } from "@/components/marketing/chat-preview";
import { Pricing } from "@/components/marketing/pricing";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* ---------------- Hero ---------------- */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 grid-hero" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:py-28">
            <div className="animate-fade-up">
              <Badge tone="brand">
                <Sparkles className="h-3 w-3" /> Live in 60 seconds — no sales call
              </Badge>
              <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[54px]">
                Your HR benefits bot,{" "}
                <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                  live in 60 seconds
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted">
                Upload your benefits guides and policy PDFs, connect Slack or
                Teams, and let employees get instant, accurate answers — cited to
                the exact page. When the bot isn&apos;t sure, it quietly routes
                the question to you.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/signup" size="lg">
                  Start free — no card <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="#how" variant="outline" size="lg">
                  See how it works
                </ButtonLink>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-accent-500" /> Answers
                  cited to source
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-accent-500" /> No IT required
                </span>
              </div>
            </div>

            <div className="animate-fade-up [animation-delay:120ms]">
              <ChatPreview />
            </div>
          </div>
        </section>

        {/* ---------------- Social proof ---------------- */}
        <section className="border-y border-border bg-surface/50">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-5 py-10 sm:grid-cols-4">
            <Stat value="87%" label="of questions auto-answered" />
            <Stat value="10+ hrs" label="reclaimed per HR manager / wk" />
            <Stat value="<60s" label="from PDF to live bot" />
            <Stat value="$99/mo" label="flat — not per seat" />
          </div>
        </section>

        {/* ---------------- Problem ---------------- */}
        <section className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            You&apos;re the single point of failure for every &ldquo;How do
            I…&rdquo; question
          </h2>
          <p className="mt-4 text-lg text-muted">
            During open enrollment and onboarding, the same benefits questions
            flood your inbox and DMs. Enterprise HRIS tools cost a fortune and
            take months to set up. Static wikis go unread. So it all comes back
            to you.
          </p>
          <p className="mt-6 text-lg font-medium">
            Policy Expert clones your knowledge from documents you already have —
            and hands the repetitive answers back to a bot.
          </p>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section id="how" className="border-t border-border bg-surface/50">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              eyebrow="How it works"
              title="Three steps. No implementation project."
              subtitle="If you can send an email attachment, you can set this up."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              <Step
                n={1}
                icon={<Upload className="h-5 w-5" />}
                title="Upload your PDFs"
                body="Drag in your benefits guide, insurance summaries, and employee handbook. We index them into a private, searchable knowledge base."
              />
              <Step
                n={2}
                icon={<Plug className="h-5 w-5" />}
                title="Connect Slack or Teams"
                body="One-click OAuth adds the bot to your workspace. Choose which channels it listens in. No admin console spelunking."
              />
              <Step
                n={3}
                icon={<MessagesSquare className="h-5 w-5" />}
                title="Employees just ask"
                body="Questions get instant, cited answers. Anything the bot isn't confident about is routed to your escalation inbox."
              />
            </div>
          </div>
        </section>

        {/* ---------------- Cited answers highlight ---------------- */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2">
          <div>
            <Badge tone="success">
              <Quote className="h-3 w-3" /> Trust, built in
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Every answer shows its work
            </h2>
            <p className="mt-4 text-lg text-muted">
              Generic AI chatbots make things up. Policy Expert answers{" "}
              <em>only</em> from your uploaded documents and cites the exact
              document and page — so employees trust it, and you can verify it in
              one click.
            </p>
            <ul className="mt-6 space-y-3">
              <FeatureLine text="Retrieval-augmented — grounded in your files, never invented" />
              <FeatureLine text="Page-level citations on every response" />
              <FeatureLine text="Confidence threshold you control before it escalates" />
            </ul>
          </div>
          <ChatPreview />
        </section>

        {/* ---------------- Features grid ---------------- */}
        <section id="features" className="border-t border-border bg-surface/50">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <SectionHeading
              eyebrow="Features"
              title="Everything the team-of-one HR manager needs"
              subtitle="Focused on benefits and policy — not a bloated everything-bot."
            />
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon={<Inbox className="h-5 w-5" />}
                title="Escalation inbox"
                body="Unanswered or low-confidence questions land in one place. Reply once and the bot learns the answer."
              />
              <Feature
                icon={<BarChart3 className="h-5 w-5" />}
                title="Usage analytics"
                body="See what employees actually ask, your deflection rate, and hours saved — great for justifying the spend."
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Cited, grounded answers"
                body="Every response links back to the source document and page. No hallucinated benefits."
              />
              <Feature
                icon={<Clock className="h-5 w-5" />}
                title="Always on"
                body="Answers at 2am, during enrollment crunch, or while you're on PTO. Employees never wait."
              />
              <Feature
                icon={<Lock className="h-5 w-5" />}
                title="Private by default"
                body="Your documents power only your bot. Not used to train shared models. SSO and audit log on Pro."
              />
              <Feature
                icon={<Zap className="h-5 w-5" />}
                title="Zero-config setup"
                body="No IT ticket, no consultant, no data mapping. Upload, connect, done."
              />
            </div>
          </div>
        </section>

        {/* ---------------- Pricing ---------------- */}
        <section id="pricing" className="mx-auto max-w-6xl px-5 py-20">
          <SectionHeading
            eyebrow="Pricing"
            title="Flat pricing. Not per seat."
            subtitle="A no-brainer next to a $350+/mo competitor or a $4,000/mo extra hire. Start free, no card required."
          />
          <div className="mt-14">
            <Pricing />
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" className="border-t border-border bg-surface/50">
          <div className="mx-auto max-w-3xl px-5 py-20">
            <SectionHeading eyebrow="FAQ" title="Questions, answered" subtitle="" />
            <div className="mt-10 divide-y divide-border">
              <Faq
                q="How long does setup really take?"
                a="Most HR managers are live in under five minutes: upload a few PDFs, click to connect Slack or Teams, and start asking. No demo or onboarding call needed."
              />
              <Faq
                q="Will it make up answers?"
                a="No. The bot only answers from the documents you upload and cites the page it used. If it can't find a confident answer, it routes the question to your escalation inbox instead of guessing."
              />
              <Faq
                q="What about Microsoft Teams?"
                a="Teams is supported on the Team and Pro plans with the same one-click connect flow as Slack."
              />
              <Faq
                q="Is my data private?"
                a="Your documents power only your bot and are never used to train shared models. Pro plans add SSO and an audit log."
              />
              <Faq
                q="What happens when a policy changes?"
                a="Upload the new PDF and archive the old one. The knowledge base re-indexes automatically, so answers reflect the latest documents."
              />
            </div>
          </div>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-16 text-center text-white">
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_30%_20%,white,transparent_40%)]" />
            <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
              Reclaim 10+ hours of your week
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-brand-100">
              Stop answering the same benefits questions. Give your team a bot
              that knows your policies cold — and live in 60 seconds.
            </p>
            <div className="relative mt-8 flex justify-center">
              <ButtonLink
                href="/signup"
                size="lg"
                className="bg-white text-brand-700 hover:bg-brand-50"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

/* ---------------- small building blocks ---------------- */

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs text-muted sm:text-sm">{label}</p>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-lg text-muted">{subtitle}</p>}
    </div>
  );
}

function Step({
  n,
  icon,
  title,
  body,
}: {
  n: number;
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card relative p-6">
      <span className="absolute right-5 top-5 text-5xl font-bold text-surface-2">
        {n}
      </span>
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="card p-5 transition-shadow hover:shadow-lg hover:shadow-brand-900/5">
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}

function FeatureLine({ text }: { text: string }) {
  return (
    <li className="flex gap-2.5">
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" />
      <span className="text-muted">{text}</span>
    </li>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
        {q}
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-muted transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="mt-3 text-muted">{a}</p>
    </details>
  );
}
