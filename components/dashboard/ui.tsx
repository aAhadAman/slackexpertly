import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("card p-5 sm:p-6", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  tone?: "brand" | "success" | "warning" | "neutral";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
    success:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    warning:
      "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    neutral: "bg-surface-2 text-muted",
  };
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <span className={cn("grid h-9 w-9 place-items-center rounded-lg", tones[tone])}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 py-14 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface-2 text-muted">
        {icon}
      </span>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
