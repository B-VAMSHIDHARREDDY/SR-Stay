import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({
  hover = false,
  padding = "md",
  tone = "light",
  className,
  children,
  ...rest
}: {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>) {
  const paddingClasses = { none: "", sm: "p-4", md: "p-6", lg: "p-8" }[padding];

  return (
    <div
      className={cn(
        "rounded-2xl border",
        tone === "dark" ? "border-white/10 bg-white/5" : "border-border bg-white shadow-sm",
        hover && "transition-shadow duration-200 hover:shadow-md",
        paddingClasses,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
