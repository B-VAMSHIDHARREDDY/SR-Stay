import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  align = "center",
  tone = "dark",
  description,
  className,
  children,
}: {
  eyebrow?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <span
          className={cn(
            "text-label mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold uppercase tracking-wide",
            tone === "light" ? "bg-white/10 text-white/90" : "bg-brand-red/8 text-brand-red",
          )}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-semibold tracking-tight sm:text-h2",
          tone === "light" ? "text-white" : "text-brand-black",
        )}
      >
        {children}
      </h2>
      {description && (
        <p className={cn("text-body mt-4", tone === "light" ? "text-white/65" : "text-brand-black/65")}>
          {description}
        </p>
      )}
    </div>
  );
}
