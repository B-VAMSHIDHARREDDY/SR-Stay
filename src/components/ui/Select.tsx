"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/cn";

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select…",
  label,
  hideLabel = false,
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
  const listRef = useRef<HTMLUListElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  const selected = options.find((o) => o.value === value) ?? null;

  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (open && rootRef.current && !rootRef.current.contains(e.target as Node)) {
        closeMenu();
      }
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
                "rounded-lg border bg-white px-3.5",
                open ? "border-brand-red ring-2 ring-brand-red/15" : "border-border hover:border-brand-black/25",
              ),
        )}
      >
        {leadingIcon && <span className="shrink-0 text-brand-red">{leadingIcon}</span>}
        <span className={cn("flex-1 truncate", !selected && "text-brand-black/40")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-brand-black/50 transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          "absolute z-50 mt-2 w-full origin-top rounded-2xl border border-border bg-white p-2 shadow-lg transition-all duration-150",
          open ? "visible translate-y-0 scale-100 opacity-100" : "invisible -translate-y-1 scale-95 opacity-0",
        )}
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
      </div>
    </div>
  );
}
