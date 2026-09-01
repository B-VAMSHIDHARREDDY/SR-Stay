"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { DURATION, EASE, fadeIn } from "@/lib/motion";
import { Badge } from "@/components/ui/Badge";
import { Select, type SelectOption } from "@/components/ui/Select";
import type { SortOption } from "@/lib/pg-api";

export interface PgFiltersValue {
  gender: string;
  budget: string;
  sharingType: string;
  amenities: string[];
  sort: SortOption;
}

export const DEFAULT_PG_FILTERS: PgFiltersValue = {
  gender: "",
  budget: "",
  sharingType: "",
  amenities: [],
  sort: "newest",
};

export interface BudgetPreset {
  id: string;
  label: string;
  min?: number;
  max?: number;
}

// Mirrors typical PG price bands (NoBroker-style quick budget chips) rather
// than a slider, so it stays consistent with the app's pill-based controls.
export const BUDGET_PRESETS: BudgetPreset[] = [
  { id: "under-8k", label: "Under ₹8k", max: 8000 },
  { id: "8k-12k", label: "₹8k – 12k", min: 8000, max: 12000 },
  { id: "12k-18k", label: "₹12k – 18k", min: 12000, max: 18000 },
  { id: "above-18k", label: "Above ₹18k", min: 18000 },
];

const GENDER_OPTIONS = [
  { value: "", label: "Any" },
  { value: "male", label: "Boys" },
  { value: "female", label: "Girls" },
  { value: "unisex", label: "Co-living" },
];

const SHARING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "Single", label: "Single" },
  { value: "Double", label: "Double" },
  { value: "Triple", label: "Triple" },
  { value: "Four Sharing", label: "4 Sharing" },
];

const AMENITY_OPTIONS = ["WiFi", "Food", "AC", "Laundry", "Power Backup", "Parking"];

const SORT_OPTIONS: SelectOption[] = [
  { value: "newest", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "border-brand-red bg-brand-red/8 text-brand-red"
          : "border-border bg-paper text-brand-black/75 hover:border-brand-red/40 hover:text-brand-red",
      )}
    >
      {children}
    </button>
  );
}

function PillGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Pill key={opt.value || "any"} active={opt.value === value} onClick={() => onChange(opt.value === value ? "" : opt.value)}>
          {opt.label}
        </Pill>
      ))}
    </div>
  );
}

export function PgFiltersBar({
  value,
  onChange,
  resultCount,
  className,
}: {
  value: PgFiltersValue;
  onChange: (value: PgFiltersValue) => void;
  resultCount?: number;
  className?: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);

  function toggleAmenity(amenity: string) {
    const next = value.amenities.includes(amenity)
      ? value.amenities.filter((a) => a !== amenity)
      : [...value.amenities, amenity];
    onChange({ ...value, amenities: next });
  }

  const activeChips = [
    value.gender && {
      id: "gender",
      label: GENDER_OPTIONS.find((o) => o.value === value.gender)?.label ?? value.gender,
      clear: () => onChange({ ...value, gender: "" }),
    },
    value.budget && {
      id: "budget",
      label: BUDGET_PRESETS.find((b) => b.id === value.budget)?.label ?? value.budget,
      clear: () => onChange({ ...value, budget: "" }),
    },
    value.sharingType && {
      id: "sharing",
      label: value.sharingType,
      clear: () => onChange({ ...value, sharingType: "" }),
    },
    ...value.amenities.map((a) => ({
      id: `amenity-${a}`,
      label: a,
      clear: () => onChange({ ...value, amenities: value.amenities.filter((x) => x !== a) }),
    })),
  ].filter(Boolean) as { id: string; label: string; clear: () => void }[];

  const hasActive = activeChips.length > 0;

  function clearAll() {
    onChange({ ...DEFAULT_PG_FILTERS, sort: value.sort });
  }

  function renderFilterFields() {
    return (
      <div className="space-y-5">
        <div>
          <p className="text-label mb-2 font-medium text-brand-black/70">Gender</p>
          <PillGroup options={GENDER_OPTIONS} value={value.gender} onChange={(v) => onChange({ ...value, gender: v })} />
        </div>
        <div>
          <p className="text-label mb-2 font-medium text-brand-black/70">Budget</p>
          <PillGroup
            options={[{ value: "", label: "Any" }, ...BUDGET_PRESETS.map((b) => ({ value: b.id, label: b.label }))]}
            value={value.budget}
            onChange={(v) => onChange({ ...value, budget: v })}
          />
        </div>
        <div>
          <p className="text-label mb-2 font-medium text-brand-black/70">Sharing type</p>
          <PillGroup options={SHARING_OPTIONS} value={value.sharingType} onChange={(v) => onChange({ ...value, sharingType: v })} />
        </div>
        <div>
          <p className="text-label mb-2 font-medium text-brand-black/70">Amenities</p>
          <div className="flex flex-wrap gap-2">
            {AMENITY_OPTIONS.map((amenity) => (
              <Pill key={amenity} active={value.amenities.includes(amenity)} onClick={() => toggleAmenity(amenity)}>
                {amenity}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Desktop: everything inline */}
      <div className="hidden md:block">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-1 flex-wrap gap-x-6 gap-y-3">
            <PillGroup options={GENDER_OPTIONS} value={value.gender} onChange={(v) => onChange({ ...value, gender: v })} />
            <PillGroup
              options={[{ value: "", label: "Any budget" }, ...BUDGET_PRESETS.map((b) => ({ value: b.id, label: b.label }))]}
              value={value.budget}
              onChange={(v) => onChange({ ...value, budget: v })}
            />
            <PillGroup options={SHARING_OPTIONS} value={value.sharingType} onChange={(v) => onChange({ ...value, sharingType: v })} />
          </div>
          <div className="w-48 shrink-0">
            <Select
              label="Sort by"
              hideLabel
              options={SORT_OPTIONS}
              value={value.sort}
              onChange={(v) => onChange({ ...value, sort: v as SortOption })}
              size="sm"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((amenity) => (
            <Pill key={amenity} active={value.amenities.includes(amenity)} onClick={() => toggleAmenity(amenity)}>
              {amenity}
            </Pill>
          ))}
        </div>
      </div>

      {/* Mobile: filter sheet trigger + sort */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-brand-black"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeChips.length > 0 && <Badge variant="brand">{activeChips.length}</Badge>}
        </button>
        <div className="flex-1">
          <Select
            label="Sort by"
            hideLabel
            options={SORT_OPTIONS}
            value={value.sort}
            onChange={(v) => onChange({ ...value, sort: v as SortOption })}
            size="sm"
          />
        </div>
      </div>

      {/* Active filter chips (both breakpoints) */}
      {hasActive && (
        <div className="flex flex-wrap items-center gap-2">
          <AnimatePresence initial={false}>
            {activeChips.map((chip) => (
              <motion.span
                key={chip.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: DURATION.fast, ease: EASE }}
                className="flex items-center gap-1.5 rounded-full bg-brand-red/10 py-1.5 pr-2 pl-3 text-xs font-semibold text-brand-red"
              >
                {chip.label}
                <button
                  type="button"
                  onClick={chip.clear}
                  aria-label={`Remove ${chip.label} filter`}
                  className="rounded-full p-0.5 hover:bg-brand-red/15"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </motion.span>
            ))}
          </AnimatePresence>
          <button type="button" onClick={clearAll} className="text-xs font-semibold text-brand-black/50 hover:text-brand-black">
            Clear all
          </button>
        </div>
      )}

      <AnimatePresence>
        {sheetOpen && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 z-100 bg-brand-black/50 md:hidden"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: DURATION.base, ease: EASE }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-4xl bg-paper p-5 shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-bold text-brand-black">Filters</p>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close filters"
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-black/5"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              {renderFilterFields()}
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="mt-6 w-full rounded-full bg-gradient-ember py-3 text-sm font-semibold text-white shadow-glow-red"
              >
                {resultCount !== undefined ? `Show ${resultCount} results` : "Show results"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
