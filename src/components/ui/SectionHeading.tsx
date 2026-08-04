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
        <p className="text-label mb-2 font-semibold uppercase tracking-wide text-brand-red">{eyebrow}</p>
      )}
      <h2
        className={cn(
          "text-3xl font-extrabold tracking-tight sm:text-h2",
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
