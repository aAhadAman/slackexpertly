"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { NAV_ITEMS } from "./nav-items";
import { cn } from "@/lib/utils";

export function Sidebar({
  org,
  escalationCount,
  onNavigate,
}: {
  org: string;
  escalationCount: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV_ITEMS.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="flex-1">{item.label}</span>
              {item.badgeKey === "escalations" && escalationCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
                  {escalationCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="rounded-lg bg-surface-2 p-3">
          <p className="text-xs font-medium text-muted">Workspace</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{org}</p>
        </div>
      </div>
    </div>
  );
}
