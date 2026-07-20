"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <ButtonLink href="/signup" size="sm">
            Start free
          </ButtonLink>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface-2"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-surface px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-surface-2 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-3">
              <ButtonLink href="/login" variant="outline" size="md">
                Sign in
              </ButtonLink>
              <ButtonLink href="/signup" size="md">
                Start free
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
