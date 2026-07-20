import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Sign in · Policy Expert" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted">
        Sign in to manage your bot and documents.
      </p>

      {error && (
        <p className="mt-5 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      )}

      <div className="mt-8">
        <AuthForm mode="signin" />
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link
          href="/signup"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
