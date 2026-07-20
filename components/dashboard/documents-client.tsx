"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
} from "lucide-react";
import type { PolicyDoc } from "@/lib/types";
import { DEMO_MODE } from "@/lib/config";
import { uploadDocument, deleteDocument } from "@/app/actions/data";
import { Panel, EmptyState } from "@/components/dashboard/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBytes, timeAgo, cn } from "@/lib/utils";

const CATEGORIES = ["Benefits", "Insurance", "Policy", "Retirement", "Other"];

export function DocumentsClient({ initial }: { initial: PolicyDoc[] }) {
  const router = useRouter();
  const [docs, setDocs] = useState<PolicyDoc[]>(initial);
  const [dragging, setDragging] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep in sync with server data after a router.refresh().
  useEffect(() => {
    setDocs(initial);
  }, [initial]);

  function guessCategory(name: string): string {
    const n = name.toLowerCase();
    if (n.includes("401") || n.includes("retire")) return "Retirement";
    if (n.includes("dental") || n.includes("medical") || n.includes("insur"))
      return "Insurance";
    if (n.includes("handbook") || n.includes("policy")) return "Policy";
    if (n.includes("benefit")) return "Benefits";
    return "Other";
  }

  async function addFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const pdfs = Array.from(files).filter(
      (f) => f.type === "application/pdf" || f.name.endsWith(".pdf")
    );
    if (!pdfs.length) return;

    // Optimistic "processing" rows.
    const optimistic: PolicyDoc[] = pdfs.map((f, i) => ({
      id: `pending-${Date.now()}-${i}`,
      name: f.name,
      category: guessCategory(f.name),
      sizeBytes: f.size,
      pages: 0,
      chunks: 0,
      status: "processing",
      uploadedAt: new Date().toISOString(),
    }));
    setDocs((d) => [...optimistic, ...d]);

    if (DEMO_MODE) {
      // No backend: simulate indexing completing.
      optimistic.forEach((doc) => {
        setTimeout(
          () =>
            setDocs((d) =>
              d.map((x) =>
                x.id === doc.id ? { ...x, status: "ready" } : x
              )
            ),
          1500 + Math.random() * 1500
        );
      });
      return;
    }

    for (const file of pdfs) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await uploadDocument(fd);
      if (!res.ok) {
        setError(res.error ?? "Upload failed.");
        setDocs((d) => d.filter((x) => !x.id.startsWith("pending-")));
        return;
      }
    }
    startTransition(() => router.refresh());
  }

  function remove(doc: PolicyDoc) {
    setDocs((d) => d.filter((x) => x.id !== doc.id));
    if (DEMO_MODE || doc.id.startsWith("pending-")) return;
    startTransition(async () => {
      const res = await deleteDocument(doc.id, doc.storagePath ?? null);
      if (!res.ok) {
        setError(res.error ?? "Delete failed.");
        router.refresh();
      }
    });
  }

  const filtered = docs.filter((d) =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      {/* dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          dragging
            ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10"
            : "border-border bg-surface hover:border-brand-400 hover:bg-surface-2/50"
        )}
      >
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <UploadCloud className="h-7 w-7" />
        </span>
        <p className="mt-4 font-semibold">
          Drop your policy PDFs here, or click to browse
        </p>
        <p className="mt-1 text-sm text-muted">
          Benefits guides, insurance summaries, handbooks — up to 25 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          hidden
          onChange={(e) => void addFiles(e.target.files)}
        />
      </div>

      {error && (
        <p className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      {/* list */}
      <Panel className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">Your documents</h2>
            <p className="text-sm text-muted">
              {docs.length} file{docs.length === 1 ? "" : "s"} in the knowledge
              base
            </p>
          </div>
          {docs.length > 0 && (
            <div className="relative w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents"
                className="w-full rounded-lg border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title={query ? "No matches" : "No documents yet"}
            description={
              query
                ? "Try a different search term."
                : "Upload your first PDF to give the bot something to answer from."
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 py-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted">
                    {CATEGORIES.includes(doc.category) ? doc.category : "Other"} ·{" "}
                    {formatBytes(doc.sizeBytes)}
                    {doc.status === "ready" && doc.chunks > 0
                      ? ` · ${doc.pages} pages · ${doc.chunks} chunks`
                      : ""}{" "}
                    · {timeAgo(doc.uploadedAt)}
                  </p>
                </div>
                <StatusBadge status={doc.status} />
                <button
                  onClick={() => remove(doc)}
                  aria-label="Delete document"
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

function StatusBadge({ status }: { status: PolicyDoc["status"] }) {
  if (status === "processing")
    return (
      <Badge tone="info">
        <Loader2 className="h-3 w-3 animate-spin" /> Uploading
      </Badge>
    );
  if (status === "error")
    return (
      <Badge tone="danger">
        <AlertCircle className="h-3 w-3" /> Error
      </Badge>
    );
  return (
    <Badge tone="success">
      <CheckCircle2 className="h-3 w-3" /> Ready
    </Badge>
  );
}
