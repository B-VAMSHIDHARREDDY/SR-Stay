"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { DURATION, EASE, fadeIn } from "@/lib/motion";

export interface SidebarItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const COLLAPSED_WIDTH = 80;
const EXPANDED_WIDTH = 256;

export function Sidebar({
  items,
  activeId,
  onSelect,
  header,
}: {
  items: SidebarItem[];
  activeId: string;
  onSelect: (id: string) => void;
  header?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function renderNav(showLabels: boolean) {
    return (
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-red/10 text-brand-red"
                  : "text-brand-black/65 hover:bg-black/5 hover:text-brand-black",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand-red transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {showLabels && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-brand-black lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <motion.aside
        animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
        transition={{ duration: DURATION.base, ease: EASE }}
        className="hidden shrink-0 flex-col overflow-hidden border-r border-border bg-white py-4 lg:flex"
      >
        <div className="flex items-center justify-between px-4 pb-4">
          {!collapsed && header}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-brand-black/50 hover:bg-black/5"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {renderNav(!collapsed)}
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-100 bg-brand-black/50 lg:hidden"
          >
            <motion.aside
              onClick={(e) => e.stopPropagation()}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: DURATION.base, ease: EASE }}
              className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white py-4 shadow-lg"
            >
              <div className="flex items-center justify-between px-4 pb-4">
                {header}
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-black/60 hover:bg-black/5"
                  aria-label="Close sidebar"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {renderNav(true)}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
