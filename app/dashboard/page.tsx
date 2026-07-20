import Link from "next/link";
import {
  MessagesSquare,
  TrendingUp,
  Inbox,
  Clock,
  ArrowRight,
  FileText,
  Plug,
  CheckCircle2,
} from "lucide-react";
import { getSessionUser } from "@/lib/auth";
import {
  getOverview,
  getEscalations,
  getDocuments,
  getIntegrations,
} from "@/lib/data";
import { PageHeader, StatCard, Panel } from "@/components/dashboard/ui";
import { VolumeChart } from "@/components/dashboard/volume-chart";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";

export const metadata = { title: "Overview · Policy Expert" };

export default async function OverviewPage() {
  const [user, { stats, weekly }, escalations, docs, integrations] =
    await Promise.all([
      getSessionUser(),
      getOverview(),
      getEscalations(),
      getDocuments(),
      getIntegrations(),
    ]);

  const firstName = user?.name.split(" ")[0] ?? "there";
  const openEscalations = escalations.filter((e) => e.status === "open");
  const readyDocs = docs.filter((d) => d.status === "ready").length;
  const slack = integrations.find((i) => i.id === "slack");
  const hasVolume = weekly.some((v) => v > 0);

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's how your benefits bot is doing."
        actions={
          <ButtonLink href="/dashboard/playground" variant="outline" size="sm">
            <MessagesSquare className="h-4 w-4" /> Test the bot
          </ButtonLink>
        }
      />

      {/* stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Questions this week"
          value={String(stats.questionsThisWeek)}
          sub="Answered in Slack / Teams"
          icon={<MessagesSquare className="h-5 w-5" />}
        />
        <StatCard
          label="Auto-answered"
          value={`${Math.round(stats.deflectionRate * 100)}%`}
          sub="Deflection rate"
          tone="success"
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Open escalations"
          value={String(stats.openEscalations)}
          sub="Awaiting your reply"
          tone="warning"
          icon={<Inbox className="h-5 w-5" />}
        />
        <StatCard
          label="Hours saved"
          value={`${stats.hoursSaved}h`}
          sub="Estimated"
          tone="neutral"
          icon={<Clock className="h-5 w-5" />}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* chart */}
        <Panel className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Questions answered</h2>
              <p className="text-sm text-muted">Last 8 weeks</p>
            </div>
            {hasVolume && (
              <Badge tone="success">
                <TrendingUp className="h-3 w-3" /> Trending up
              </Badge>
            )}
          </div>
          {hasVolume ? (
            <VolumeChart data={weekly} />
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <MessagesSquare className="h-8 w-8 text-muted-2" />
              <p className="mt-2 text-sm text-muted">
                No questions yet — once your bot is live in Slack/Teams, activity
                shows up here.
              </p>
            </div>
          )}
        </Panel>

        {/* setup checklist */}
        <Panel>
          <h2 className="font-semibold">Setup</h2>
          <p className="text-sm text-muted">Get your bot live in 3 steps.</p>
          <ul className="mt-4 space-y-3">
            <SetupRow
              done={readyDocs > 0}
              label={
                readyDocs > 0
                  ? `${readyDocs} document${readyDocs === 1 ? "" : "s"} indexed`
                  : "Upload your policy PDFs"
              }
              href="/dashboard/documents"
              icon={<FileText className="h-4 w-4" />}
            />
            <SetupRow
              done={!!slack?.connected}
              label={
                slack?.connected ? "Slack connected" : "Connect Slack or Teams"
              }
              href="/dashboard/integrations"
              icon={<Plug className="h-4 w-4" />}
            />
            <SetupRow
              done={false}
              label="Add your billing details"
              href="/dashboard/billing"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
          </ul>
        </Panel>
      </div>

      {/* escalations preview */}
      <Panel className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Needs your attention</h2>
            <p className="text-sm text-muted">Questions the bot routed to you</p>
          </div>
          <Link
            href="/dashboard/escalations"
            className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {openEscalations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
            <p className="mt-2 text-sm text-muted">
              Nothing waiting on you — the bot is handling things.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {openEscalations.slice(0, 3).map((e) => (
              <li key={e.id} className="flex items-start gap-3 py-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{e.question}</p>
                  <p className="mt-0.5 text-xs text-muted">
                    {e.employee} · {e.channel} · {timeAgo(e.askedAt)}
                  </p>
                </div>
                <Badge tone="warning">Open</Badge>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

function SetupRow({
  done,
  label,
  href,
  icon,
}: {
  done: boolean;
  label: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-3 rounded-lg p-2 -mx-2 hover:bg-surface-2"
      >
        <span
          className={
            done
              ? "grid h-7 w-7 place-items-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-muted"
          }
        >
          {done ? <CheckCircle2 className="h-4 w-4" /> : icon}
        </span>
        <span
          className={
            done ? "text-sm text-muted line-through" : "text-sm font-medium"
          }
        >
          {label}
        </span>
        {!done && <ArrowRight className="ml-auto h-4 w-4 text-muted-2" />}
      </Link>
    </li>
  );
}
