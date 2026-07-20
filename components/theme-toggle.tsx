"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("pe-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={
        "grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface-2 hover:text-foreground transition-colors " +
        (className ?? "")
      }
    >
      {mounted && dark ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
