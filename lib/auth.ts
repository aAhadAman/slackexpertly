import { cookies } from "next/headers";
import { DEMO_MODE } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export const DEMO_COOKIE = "pe-demo-user";

export interface SessionUser {
  email: string;
  name: string;
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "there";
  return local
    .split(/[.\-_]/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

/** Returns the current signed-in user, or null. Works in demo + Supabase modes. */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (DEMO_MODE) {
    const store = await cookies();
    const email = store.get(DEMO_COOKIE)?.value;
    if (!email) return null;
    return { email, name: nameFromEmail(email) };
  }

  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  return {
    email: user.email,
    name: (user.user_metadata?.full_name as string) || nameFromEmail(user.email),
  };
}
