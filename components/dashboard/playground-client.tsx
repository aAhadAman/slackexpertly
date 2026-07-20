"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, FileText, RotateCcw, ArrowUpRight } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { MOCK_SUGGESTIONS } from "@/lib/mock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Canned front-end responder. In production this hits your N8N/RAG endpoint. */
const CANNED: { match: RegExp; answer: Omit<ChatMessage, "id" | "role"> }[] = [
  {
    match: /deduct/i,
    answer: {
      content:
        "On the Aetna PPO plan, the in-network deductible is $1,500 for individual and $3,000 for family coverage. Preventive care is covered at 100% and doesn't count toward the deductible.",
      citations: [
        { doc: "Medical Plan – Aetna PPO.pdf", page: 4 },
        { doc: "2025 Benefits Guide.pdf", page: 11 },
      ],
    },
  },
  {
    match: /401|match|retire/i,
    answer: {
      content:
        "The company matches 100% of your 401(k) contributions up to 4% of your salary, plus 50% on the next 2%. You're fully vested after two years of service.",
      citations: [{ doc: "401(k) Plan Details.pdf", page: 3 }],
    },
  },
  {
    match: /dependent|enroll|add/i,
    answer: {
      content:
        "During open enrollment you can add a dependent from the Benefits portal under 'Life & Coverage → Add Dependent.' You'll need their date of birth and SSN. Outside enrollment, adding a dependent requires a qualifying life event within 30 days.",
      citations: [{ doc: "2025 Benefits Guide.pdf", page: 22 }],
    },
  },
  {
    match: /dental|vision|invisalign/i,
    answer: {
      content:
        "The dental plan covers preventive care at 100% and major services at 50% after the deductible, up to a $2,000 annual maximum. Orthodontia has a separate $1,500 lifetime maximum and applies to dependents under 19.",
      citations: [{ doc: "Dental & Vision Summary.pdf", page: 2 }],
    },
  },
];

const ESCALATE: Omit<ChatMessage, "id" | "role"> = {
  content:
    "I couldn't find a confident answer to that in your documents, so I've routed this question to your HR manager. They'll follow up shortly.",
  escalated: true,
};

let idc = 0;
const nextId = () => `pm-${idc++}`;

export function PlaygroundClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  function respond(text: string) {
    const found = CANNED.find((c) => c.match.test(text));
    const answer = found ? found.answer : ESCALATE;
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: nextId(), role: "bot", ...answer }]);
    }, 900);
  }

  function send(text: string) {
    const t = text.trim();
    if (!t || typing) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", content: t }]);
    setInput("");
    respond(t);
  }

  return (
    <div className="card flex h-[calc(100vh-13rem)] min-h-[460px] flex-col overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-semibold">Policy Expert</p>
            <p className="flex items-center gap-1 text-xs text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              Answering from 5 documents
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        )}
      </div>

      {/* messages */}
      <div
        ref={scrollRef}
        className="scrollbar-thin flex-1 space-y-5 overflow-y-auto p-5"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
              <Sparkles className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-semibold">
              Ask what an employee would ask
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted">
              This is exactly how the bot behaves in Slack or Teams — grounded
              answers with citations, escalation when unsure.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {MOCK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted transition-colors hover:border-brand-400 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <Message key={m.id} m={m} />
        ))}

        {typing && (
          <div className="flex gap-3">
            <BotAvatar />
            <div className="flex items-center gap-1 rounded-xl rounded-tl-none border border-border bg-surface-2/60 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-muted-2 animate-pulse-dot"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about benefits, PTO, insurance…"
            className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
          />
          <Button type="submit" disabled={!input.trim() || typing}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function Message({ m }: { m: ChatMessage }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-none bg-brand-600 px-4 py-2.5 text-sm text-white">
          {m.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <BotAvatar />
      <div className="max-w-[85%]">
        <div
          className={cn(
            "rounded-2xl rounded-tl-none border px-4 py-3 text-sm leading-relaxed",
            m.escalated
              ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
              : "border-border bg-surface-2/60"
          )}
        >
          {m.content}
          {m.citations && m.citations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {m.citations.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300"
                >
                  <FileText className="h-3 w-3" />
                  {c.doc} · p.{c.page}
                </span>
              ))}
            </div>
          )}
          {m.escalated && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              <ArrowUpRight className="h-3 w-3" /> Routed to HR
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BotAvatar() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white">
      <Sparkles className="h-4 w-4" />
    </span>
  );
}
