import Link from "next/link";
import { Check } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Start free · Policy Expert" };

export default function SignupPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        Start free — live in 60 seconds
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        Free while in beta. No credit card required.
      </p>

      <ul className="mt-4 space-y-1.5">
        {[
          "Every feature free during beta",
          "Upload PDFs and connect Slack instantly",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2 text-sm text-muted">
            <Check className="h-4 w-4 text-accent-500" /> {t}
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <AuthForm mode="signup" />
      </div>

      <p className="mt-4 text-center text-xs text-muted-2">
        By creating an account you agree to our Terms and Privacy Policy.
      </p>
      <p className="mt-4 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-brand-600 hover:text-brand-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
