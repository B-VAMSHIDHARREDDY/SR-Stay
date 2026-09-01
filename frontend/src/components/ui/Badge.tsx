import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant = "brand" | "neutral" | "plum" | "success" | "warning" | "error";

const variantClasses: Record<BadgeVariant, string> = {
  brand: "bg-brand-red/10 text-brand-red",
  neutral: "bg-black/5 text-brand-black",
  plum: "bg-plum/8 text-plum",
  success: "bg-success/10 text-success-dark",
  warning: "bg-warning/10 text-warning-dark",
  error: "bg-error/10 text-error-dark",
};

export function Badge({
  variant = "brand",
  className,
  children,
  ...rest
}: {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
