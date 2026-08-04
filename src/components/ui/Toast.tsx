"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/useIsClient";

export type ToastVariant = "success" | "warning" | "error" | "info";

export interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastItem extends Required<Pick<ToastOptions, "title" | "variant" | "duration">> {
  id: string;
  description?: string;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantConfig: Record<ToastVariant, { icon: typeof CheckCircle2; classes: string }> = {
  success: { icon: CheckCircle2, classes: "border-success/25 bg-success/5 text-success-dark" },
  warning: { icon: AlertTriangle, classes: "border-warning/25 bg-warning/5 text-warning-dark" },
  error: { icon: XCircle, classes: "border-error/25 bg-error/5 text-error-dark" },
  info: { icon: Info, classes: "border-brand-black/15 bg-brand-black/5 text-brand-black" },
};

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
  };

  const schedule = useCallback(() => {
    startedAt.current = Date.now();
    timer.current = setTimeout(() => onDismiss(item.id), remaining.current);
  }, [item.id, onDismiss]);

  useEffect(() => {
    schedule();
    return clear;
  }, [schedule]);

  function handlePause() {
    clear();
    remaining.current -= Date.now() - startedAt.current;
  }

  const { icon: Icon, classes } = variantConfig[item.variant];

  return (
    <div
      role="status"
      onMouseEnter={handlePause}
      onMouseLeave={schedule}
      className={cn(
        "animate-toast-in pointer-events-auto flex w-full items-start gap-3 rounded-2xl border bg-white p-4 shadow-lg",
        classes,
      )}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{item.title}</p>
        {item.description && <p className="mt-0.5 text-sm opacity-80">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-lg p-1 opacity-60 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const mounted = useIsClient();

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [
      ...prev,
      {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "info",
        duration: options.duration ?? 4000,
      },
    ]);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed bottom-4 right-4 left-4 z-100 flex flex-col items-end gap-3 sm:left-auto sm:w-full sm:max-w-sm">
            {items.map((item) => (
              <ToastCard key={item.id} item={item} onDismiss={dismiss} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
