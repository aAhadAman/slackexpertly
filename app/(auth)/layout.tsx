import Link from "next/link";
import { ShieldCheck, Quote } from "lucide-react";
import { Logo } from "@/components/logo";
import { DEMO_MODE } from "@/lib/config";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form side */}
      <div className="flex flex-col px-5 py-8">
        <div className="mx-auto flex w-full max-w-sm items-center justify-between">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-foreground">
            ← Home
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          {children}
          {DEMO_MODE && (
            <p className="mt-6 rounded-lg border border-dashed border-border bg-surface-2/50 px-3 py-2 text-center text-xs text-muted">
              Demo mode — Supabase isn&apos;t connected yet, so any email and a
              6+ character password will sign you in.
            </p>
          )}
        </div>
      </div>

      {/* brand side */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 lg:block">
        <div className="pointer-events-none absolute inset-0 opacity-[0.15] [background-image:radial-gradient(circle_at_25%_15%,white,transparent_45%)]" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2 text-brand-100">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-medium">
              Grounded, cited answers — no hallucinations
            </span>
          </div>

          <div>
            <Quote className="h-10 w-10 text-brand-300" />
            <p className="mt-4 max-w-md text-2xl font-medium leading-snug">
              &ldquo;It answered the same enrollment questions I used to spend my
              whole week on — and pointed everyone to the exact page.&rdquo;
            </p>
            <p className="mt-4 text-sm text-brand-200">
              The team-of-one HR manager we built this for
            </p>
          </div>

          <div className="flex gap-8 text-sm">
            <div>
              <p className="text-2xl font-bold">87%</p>
              <p className="text-brand-200">auto-answered</p>
            </div>
            <div>
              <p className="text-2xl font-bold">&lt;60s</p>
              <p className="text-brand-200">to go live</p>
            </div>
            <div>
              <p className="text-2xl font-bold">10+ hrs</p>
              <p className="text-brand-200">saved / week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
