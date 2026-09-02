"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { useIsClient } from "@/lib/useIsClient";
import { DURATION, EASE, dropdownPanel } from "@/lib/motion";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

interface Coords {
  top: number;
  left: number;
  width: number;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  label,
  hideLabel = false,
  required = false,
  leadingIcon,
  searchable = false,
  emptyMessage = "No results found",
  size = "md",
  bare = false,
  className,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  hideLabel?: boolean;
  required?: boolean;
  leadingIcon?: ReactNode;
  searchable?: boolean;
  emptyMessage?: string;
  size?: "sm" | "md" | "lg";
  /** Renders the trigger without its own border/background — for embedding inside another bordered container. */
  bare?: boolean;
  className?: string;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mounted = useIsClient();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [coords, setCoords] = useState<Coords | null>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  function updateCoords() {
    const rect = rootRef.current?.getBoundingClientRect();
    if (rect) setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }

  // The panel is portaled to <body> (see the render below) so it always
  // paints above the page regardless of any ancestor's stacking context —
  // e.g. a section using `isolation: isolate` for an unrelated texture
  // overlay would otherwise trap a same-DOM z-index panel behind later
  // siblings. Keeping it fixed-positioned and re-measured on scroll/resize
  // is what lets it still track the trigger's on-screen position.
  useEffect(() => {
    if (!open) return;
    updateCoords();
    window.addEventListener("scroll", updateCoords, true);
    window.addEventListener("resize", updateCoords);
    return () => {
      window.removeEventListener("scroll", updateCoords, true);
      window.removeEventListener("resize", updateCoords);
    };
  }, [open]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (!open) return;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      closeMenu();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  useEffect(() => {
    if (open && activeIndex >= 0) {
      const el = listRef.current?.children[activeIndex] as HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex, open]);

  function openMenu() {
    const idx = options.findIndex((o) => o.value === value);
    setActiveIndex(idx >= 0 ? idx : 0);
    setOpen(true);
    if (searchable) requestAnimationFrame(() => searchRef.current?.focus());
  }

  function closeMenu() {
    setOpen(false);
    setQuery("");
  }

  function selectIndex(idx: number) {
    const opt = filtered[idx];
    if (!opt) return;
    onChange(opt.value);
    closeMenu();
  }

  function handleTriggerKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      openMenu();
    }
  }

  function handleListKeyDown(e: KeyboardEvent<HTMLUListElement | HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(filtered.length - 1);
        break;
      case "Enter":
        e.preventDefault();
        selectIndex(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        rootRef.current?.querySelector<HTMLButtonElement>("[data-select-trigger]")?.focus();
        break;
      case "Tab":
        closeMenu();
        break;
    }
  }

  const sizeClasses = { sm: "h-9 text-sm", md: "h-11 text-sm", lg: "h-12 text-base" }[size];

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {label && (
        <label
          htmlFor={id}
          className={hideLabel ? "sr-only" : "text-label mb-1.5 block font-medium text-brand-black/80"}
        >
          {label}
          {required && <span className="ml-0.5 text-error">*</span>}
        </label>
      )}
      <button
        id={id}
        type="button"
        data-select-trigger
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex w-full items-center gap-2 text-left transition-colors",
          sizeClasses,
          bare
            ? "bg-transparent"
            : cn(
                "rounded-xl border bg-paper px-3.5",
                open ? "border-brand-red ring-2 ring-brand-red/15" : "border-border hover:border-brand-black/25",
              ),
        )}
      >
        {leadingIcon && <span className="shrink-0 text-brand-red">{leadingIcon}</span>}
        <span className={cn("flex-1 truncate", !selected && "text-brand-black/40")}>
          {selected ? selected.label : placeholder}
        </span>
        <motion.span
          className="shrink-0 text-brand-black/50"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: DURATION.fast, ease: EASE }}
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </motion.span>
      </button>

      {mounted &&
        coords &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={panelRef}
                variants={dropdownPanel}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ position: "fixed", top: coords.top, left: coords.left, width: coords.width }}
                className="z-50 origin-top rounded-2xl border border-border bg-paper p-2 shadow-lg"
              >
                {searchable && (
                  <div className="mb-2 flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                    <Search className="h-4 w-4 shrink-0 text-brand-black/40" aria-hidden="true" />
                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setActiveIndex(0);
                      }}
                      onKeyDown={handleListKeyDown}
                      placeholder="Search…"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-brand-black/40"
                    />
                  </div>
                )}

                <ul
                  ref={listRef}
                  role="listbox"
                  tabIndex={searchable ? -1 : 0}
                  aria-activedescendant={activeIndex >= 0 ? `${id}-opt-${activeIndex}` : undefined}
                  onKeyDown={!searchable ? handleListKeyDown : undefined}
                  className="ui-scrollbar max-h-60 space-y-0.5 overflow-y-auto"
                >
                  {filtered.length === 0 && (
                    <li className="px-3 py-6 text-center text-sm text-brand-black/45">{emptyMessage}</li>
                  )}
                  {filtered.map((opt, i) => {
                    const isSelected = opt.value === value;
                    const isActive = i === activeIndex;
                    return (
                      <li
                        key={opt.value}
                        id={`${id}-opt-${i}`}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => selectIndex(i)}
                        className={cn(
                          "flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors",
                          isActive && "bg-brand-red/8",
                          isSelected ? "font-semibold text-brand-red" : "text-brand-black",
                        )}
                      >
                        {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                        <span className="flex-1 truncate">{opt.label}</span>
                        {isSelected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
