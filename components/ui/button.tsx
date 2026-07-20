import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/25 active:scale-[.98]",
  secondary:
    "bg-surface-2 text-foreground hover:bg-border/70 border border-border",
  outline:
    "border border-border bg-surface text-foreground hover:bg-surface-2",
  ghost: "text-muted hover:text-foreground hover:bg-surface-2",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-600/25 active:scale-[.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px]",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: CommonProps &
  { href: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
