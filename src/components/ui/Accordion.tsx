"use client";

import { useState, type ReactNode } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";

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
              "rounded-2xl border bg-white transition-colors duration-200",
              open ? "border-brand-red/40" : "border-border",
            )}
          >
            <h3 className="text-base">
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`${item.id}-panel`}
                id={`${item.id}-trigger`}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-brand-black"
              >
                {item.question}
                <Plus
                  className={cn(
                    "h-4 w-4 shrink-0 text-brand-red transition-transform duration-200",
                    open && "rotate-45",
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={`${item.id}-trigger`}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm leading-relaxed text-brand-black/65">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
