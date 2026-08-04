"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";
import { DURATION, EASE } from "@/lib/motion";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = { sm: "h-9 text-sm", md: "h-11 text-sm", lg: "h-12 text-base" };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, helperText, error, icon, size = "md", type = "text", required, disabled, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="text-label mb-1.5 block font-medium text-brand-black/80">
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-black/40">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={cn(
            "w-full rounded-lg border bg-white text-brand-black outline-none transition-colors placeholder:text-brand-black/40",
            sizeClasses[size],
            icon ? "pl-10 pr-3.5" : "px-3.5",
            isPassword && "pr-10",
            disabled && "cursor-not-allowed bg-surface-muted text-brand-black/40",
            error
              ? "border-error focus:border-error focus:ring-2 focus:ring-error/15"
              : "border-border focus:border-brand-red focus:ring-2 focus:ring-brand-red/15",
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-black/40 hover:text-brand-black"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        {error ? (
          <motion.p
            key="error"
            id={`${inputId}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            className="text-caption mt-1.5 text-error"
          >
            {error}
          </motion.p>
        ) : helperText ? (
          <motion.p
            key="helper"
            id={`${inputId}-helper`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            className="text-caption mt-1.5 text-brand-black/50"
          >
            {helperText}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
});
