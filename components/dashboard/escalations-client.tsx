"use client";

import { useState } from "react";
import {
  Inbox,
  Send,
  Check,
  X,
  MessageSquareReply,
  Filter,
} from "lucide-react";
import type { Escalation, EscalationStatus } from "@/lib/types";
import { Panel, EmptyState } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timeAgo, cn } from "@/lib/utils";

type Filter = "open" | "all";

export function EscalationsClient({ initial }: { initial: Escalation[] }) {
  const [items, setItems] = useState<Escalation[]>(initial);
  const [filter, setFilter] = useState<Filter>("open");
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [reply, setReply] = useState("");

  function setStatus(id: string, status: EscalationStatus) {
    setItems((it) => it.map((x) => (x.id === id ? { ...x, status } : x)));
    if (replyingId === id) {
      setReplyingId(null);
      setReply("");
    }
  }

  const visible = items.filter((e) =>
    filter === "open" ? e.status === "open" : true
  );
  const openCount = items.filter((e) => e.status === "open").length;

  return (
    <>
      <div className="mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted" />
        {(["open", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors",
              filter === f
                ? "bg-brand-600 text-white"
                : "bg-surface-2 text-muted hover:text-foreground"
            )}
          >
            {f}
            {f === "open" && openCount > 0 && ` (${openCount})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel>
          <EmptyState
            icon={<Inbox className="h-6 w-6" />}
            title="Inbox zero 🎉"
            description="No questions are waiting on you. The bot is handling things."
          />
        </Panel>
      ) : (
        <div className="space-y-3">
          {visible.map((e) => (
            <Panel key={e.id} className="!p-4">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1 h-2 w-2 shrink-0 rounded-full",
                    e.status === "open"
                      ? "bg-amber-400"
                      : e.status === "answered"
                        ? "bg-emerald-500"
                        : "bg-muted-2"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{e.question}</p>
                  <p className="mt-1 text-xs text-muted">
                    {e.employee} · {e.channel} · {timeAgo(e.askedAt)}
                  </p>
                  <p className="mt-2 text-xs text-muted">
                    <span className="font-medium text-muted-2">
                      Why escalated:
                    </span>{" "}
                    {e.reason}
                  </p>

                  {replyingId === e.id && (
                    <div className="mt-3">
                      <textarea
                        value={reply}
                        onChange={(ev) => setReply(ev.target.value)}
                        rows={3}
                        placeholder="Type your answer — it'll be sent back in the thread and taught to the bot."
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
                      />
                      <div className="mt-2 flex gap-2">
                        <Button
                          size="sm"
                          disabled={!reply.trim()}
                          onClick={() => setStatus(e.id, "answered")}
                        >
                          <Send className="h-4 w-4" /> Send &amp; teach
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setReplyingId(null);
                            setReply("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <Badge
                    tone={
                      e.status === "open"
                        ? "warning"
                        : e.status === "answered"
                          ? "success"
                          : "neutral"
                    }
                  >
                    {e.status}
                  </Badge>
                  {e.status === "open" && replyingId !== e.id && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setReplyingId(e.id);
                          setReply("");
                        }}
                        className="flex items-center gap-1 rounded-lg bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300"
                      >
                        <MessageSquareReply className="h-3.5 w-3.5" /> Reply
                      </button>
                      <button
                        onClick={() => setStatus(e.id, "dismissed")}
                        aria-label="Dismiss"
                        className="grid h-7 w-7 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {e.status === "answered" && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" /> Answered
                    </span>
                  )}
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
