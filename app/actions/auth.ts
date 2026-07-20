"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DEMO_MODE } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { DEMO_COOKIE } from "@/lib/auth";

export interface AuthState {
  error?: string;
  message?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function setDemoSession(email: string) {
  const store = await cookies();
  store.set(DEMO_COOKIE, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isValidEmail(email)) return { error: "Enter a valid email address." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  if (DEMO_MODE) {
    await setDemoSession(email);
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { error } = await supabase!.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/dashboard");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const company = String(formData.get("company") ?? "").trim();

  if (!isValidEmail(email)) return { error: "Enter a valid email address." };
  if (password.length < 6)
    return { error: "Password must be at least 6 characters." };

  if (DEMO_MODE) {
    await setDemoSession(email);
    redirect("/dashboard");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase!.auth.signUp({
    email,
    password,
    options: {
      data: { company },
      emailRedirectTo: `${appUrl}/auth/callback`,
    },
  });
  if (error) return { error: error.message };

  // If the project requires email confirmation, no session is returned yet.
  if (!data.session) {
    return {
      message:
        "Almost there — check your inbox for a confirmation link, then sign in.",
    };
  }
  redirect("/dashboard");
}

export async function signOut() {
  if (DEMO_MODE) {
    const store = await cookies();
    store.delete(DEMO_COOKIE);
    redirect("/login");
  }
  const supabase = await createClient();
  await supabase!.auth.signOut();
  redirect("/login");
}
