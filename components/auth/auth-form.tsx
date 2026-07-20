"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { signIn, signUp, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const action = mode === "signin" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    action,
    {}
  );

  return (
    <form action={formAction} className="space-y-4">
      {mode === "signup" && (
        <Field label="Company name" htmlFor="company">
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Northwind Labs"
            className={inputCls}
          />
        </Field>
      )}

      <Field label="Work email" htmlFor="email">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={inputCls}
        />
      </Field>

      <Field
        label="Password"
        htmlFor="password"
        aside={
          mode === "signin" ? (
            <Link
              href="#"
              className="text-xs text-brand-600 hover:text-brand-700"
            >
              Forgot?
            </Link>
          ) : undefined
        }
      >
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder="••••••••"
          className={inputCls}
        />
      </Field>

      {state.error && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {state.error}
        </p>
      )}

      {state.message && (
        <p className="flex items-start gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          {state.message}
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {mode === "signin" ? "Sign in" : "Create account"}
      </Button>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm outline-none transition-shadow placeholder:text-muted-2 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20";

function Field({
  label,
  htmlFor,
  aside,
  children,
}: {
  label: string;
  htmlFor: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {aside}
      </div>
      {children}
    </div>
  );
}
