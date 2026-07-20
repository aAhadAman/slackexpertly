import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showText = true,
}: {
  className?: string;
  href?: string;
  showText?: boolean;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2.5 group", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-600/30 transition-transform group-hover:scale-105">
        <ShieldCheck className="h-[18px] w-[18px]" strokeWidth={2.4} />
      </span>
      {showText && (
        <span className="text-[15px] font-semibold tracking-tight">
          Policy<span className="text-brand-600">Expert</span>
        </span>
      )}
    </Link>
  );
}
