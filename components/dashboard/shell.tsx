"use client";

import { useState } from "react";
import { Menu, X, LogOut, ChevronDown } from "lucide-react";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function DashboardShell({
  user,
  org,
  escalationCount,
  children,
}: {
  user: { name: string; email: string };
  org: string;
  escalationCount: number;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-surface lg:block">
        <div className="sticky top-0 h-screen">
          <Sidebar org={org} escalationCount={escalationCount} />
        </div>
      </aside>

      {/* mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-surface shadow-xl">
            <button
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface-2"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar
              org={org}
              escalationCount={escalationCount}
              onNavigate={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <button
            onClick={() => setDrawerOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <ThemeToggle />

            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 hover:bg-surface-2"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-semibold text-white">
                  {initials}
                </span>
                <span className="hidden text-sm font-medium sm:block">
                  {user.name}
                </span>
                <ChevronDown className="hidden h-4 w-4 text-muted sm:block" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="truncate text-xs text-muted">
                        {user.email}
                      </p>
                    </div>
                    <form action={signOut}>
                      <button
                        type="submit"
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className={cn("flex-1 px-4 py-6 sm:px-6 lg:px-8")}>
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
