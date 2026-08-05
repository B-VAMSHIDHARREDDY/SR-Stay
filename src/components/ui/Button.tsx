"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { magneticHover } from "@/lib/motion";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "outline-inverse"
  | "ghost"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

type OwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: ReactNode;
};

/** Motion redefines these DOM event handlers with its own (PanInfo-based) signatures. */
type MotionConflictingProps =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

type AsButton = OwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflictingProps> & { href?: undefined };
type AsLink = OwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, MotionConflictingProps> & { href: string };

export type ButtonProps = AsButton | AsLink;

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-[background-color,box-shadow,filter,color] duration-200 focus-visible:outline-2 focus-visible:outline-brand-red focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gradient-ember text-white shadow-glow-red hover:brightness-110",
  secondary: "bg-gradient-ink text-white shadow-md hover:brightness-125",
  outline: "border-2 border-brand-black/15 text-brand-black hover:border-brand-black hover:bg-brand-black hover:text-white",
  "outline-inverse": "border border-white/30 bg-white/5 text-white hover:bg-white/10",
  ghost: "text-brand-black hover:bg-black/5",
  danger: "bg-error text-white hover:bg-error-dark",
  success: "bg-success text-white hover:bg-success-dark",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 px-4 text-sm",
  md: "h-11 gap-2 px-6 text-sm",
  lg: "h-13 gap-2 px-8 text-base",
};

const MotionLink = motion.create(Link);

/** Subtle tactile feedback — only applied while the button is interactive. */
const tapHover = magneticHover;

function Spinner() {
  return (
    <motion.svg
      className="h-4 w-4 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path
        className="opacity-90"
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </motion.svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconPosition = "left",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading && "pointer-events-none opacity-80",
    className,
  );

  const content = (
    <>
      {loading && <Spinner />}
      {!loading && icon && iconPosition === "left" ? icon : null}
      <span>{children}</span>
      {!loading && icon && iconPosition === "right" ? icon : null}
    </>
  );

  if (rest.href) {
    const { href, ...anchorRest } = rest as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      MotionConflictingProps
    > & { href: string };
    return (
      <MotionLink
        href={href}
        className={classes}
        aria-disabled={loading || undefined}
        {...(!loading ? tapHover : {})}
        {...anchorRest}
      >
        {content}
      </MotionLink>
    );
  }

  const buttonRest = rest as Omit<ButtonHTMLAttributes<HTMLButtonElement>, MotionConflictingProps>;
  const isDisabled = loading || buttonRest.disabled;
  return (
    <motion.button
      type={buttonRest.type ?? "button"}
      className={classes}
      disabled={isDisabled}
      {...(!isDisabled ? tapHover : {})}
      {...buttonRest}
    >
      {content}
    </motion.button>
  );
}
