"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { DURATION, EASE } from "@/lib/motion";

export interface AccordionItemData {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

export function Accordion({
  items,
  defaultOpenId,
  allowMultiple = false,
  className,
}: {
  items: AccordionItemData[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}) {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(defaultOpenId ? [defaultOpenId] : []));

  function toggle(id: string) {
    setOpenIds((prev) => {
      const isOpen = prev.has(id);
      if (allowMultiple) {
        const next = new Set(prev);
        if (isOpen) next.delete(id);
        else next.add(id);
        return next;
      }
      return isOpen ? new Set() : new Set([id]);
    });
  }

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const open = openIds.has(item.id);
        return (
          <div
            key={item.id}
            className={cn(
              "rounded-3xl border bg-paper transition-[border-color,box-shadow] duration-200",
              open ? "border-brand-red/30 shadow-md" : "border-border",
            )}
          >
            <h3 className="text-base">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${item.id}-panel`}
                id={`${item.id}-trigger`}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-display font-semibold text-brand-black"
              >
                {item.question}
                <motion.span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-200",
                    open ? "bg-gradient-ember text-white" : "bg-black/5 text-brand-black/60",
                  )}
                  animate={{ rotate: open ? 45 : 0 }}
                  transition={{ duration: DURATION.fast, ease: EASE }}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-trigger`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-brand-black/65">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
