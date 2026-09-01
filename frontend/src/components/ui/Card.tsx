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

const toneClasses = {
  light: "border-border bg-paper shadow-sm",
  dark: "border-white/10 bg-white/5 text-white",
  gradient: "border-transparent bg-gradient-ember text-white shadow-glow-red",
  ink: "border-transparent bg-gradient-ink text-white shadow-md",
} as const;

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
  tone?: "light" | "dark" | "gradient" | "ink";
  className?: string;
  children: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, MotionConflictingProps>) {
  const paddingClasses = { none: "", sm: "p-4", md: "p-6", lg: "p-8" }[padding];

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: DURATION.fast, ease: EASE }}
      className={cn(
        "rounded-2xl border",
        toneClasses[tone],
        hover && "transition-shadow duration-200 hover:shadow-lg",
        paddingClasses,
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
