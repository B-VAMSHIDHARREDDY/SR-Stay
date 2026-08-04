"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE } from "@/lib/motion";

type MotionConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

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
} & Omit<HTMLAttributes<HTMLDivElement>, MotionConflictingProps>) {
  const paddingClasses = { none: "", sm: "p-4", md: "p-6", lg: "p-8" }[padding];

  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: DURATION.fast, ease: EASE }}
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
    </motion.div>
  );
}
