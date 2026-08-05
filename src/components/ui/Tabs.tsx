"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE } from "@/lib/motion";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({
  items,
  defaultTabId,
  className,
}: {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
}) {
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function focusTab(id: string) {
    setActiveId(id);
    tabRefs.current[id]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      focusTab(items[(index + 1) % items.length].id);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusTab(items[(index - 1 + items.length) % items.length].id);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusTab(items[0].id);
    } else if (e.key === "End") {
      e.preventDefault();
      focusTab(items[items.length - 1].id);
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label="Tabs"
        className="flex items-center gap-1 rounded-full border border-border bg-surface-muted p-1"
      >
        {items.map((item, index) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              role="tab"
              type="button"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={active}
              aria-controls={`${baseId}-panel-${item.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "relative flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200",
                active ? "text-white" : "text-brand-black/55 hover:text-brand-black",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${baseId}-tab-indicator`}
                  className="absolute inset-0 rounded-full bg-gradient-ember shadow-glow-red"
                  transition={{ duration: DURATION.base, ease: EASE }}
                />
              )}
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </div>
      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${baseId}-panel-${item.id}`}
          aria-labelledby={`${baseId}-tab-${item.id}`}
          hidden={item.id !== activeId}
          className="pt-4"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
