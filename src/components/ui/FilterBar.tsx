"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Badge } from "./Badge";
import { Select, type SelectOption } from "./Select";

export interface FilterGroup {
  id: string;
  label: string;
  options: SelectOption[];
}

export function FilterBar({
  groups,
  values,
  onChange,
  className,
}: {
  groups: FilterGroup[];
  values: Record<string, string>;
  onChange: (id: string, value: string) => void;
  className?: string;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeEntries = groups.map((g) => ({ group: g, value: values[g.id] })).filter((e) => e.value);

  function renderFields() {
    return groups.map((group) => (
      <Select
        key={group.id}
        label={group.label}
        options={group.options}
        value={values[group.id] ?? ""}
        onChange={(v) => onChange(group.id, v)}
        size="sm"
      />
    ));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="hidden flex-wrap items-end gap-3 md:flex">
        {groups.map((group) => (
          <div key={group.id} className="w-44">
            <Select
              label={group.label}
              options={group.options}
              value={values[group.id] ?? ""}
              onChange={(v) => onChange(group.id, v)}
              size="sm"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setSheetOpen(true)}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-brand-black md:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Filters
        {activeEntries.length > 0 && <Badge variant="brand">{activeEntries.length}</Badge>}
      </button>

      {activeEntries.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activeEntries.map(({ group, value }) => {
            const option = group.options.find((o) => o.value === value);
            return (
              <span
                key={group.id}
                className="flex items-center gap-1.5 rounded-lg bg-brand-red/10 py-1.5 pr-2 pl-3 text-xs font-semibold text-brand-red"
              >
                {option?.label ?? value}
                <button
                  type="button"
                  onClick={() => onChange(group.id, "")}
                  aria-label={`Remove ${group.label} filter`}
                  className="rounded-full p-0.5 hover:bg-brand-red/15"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </span>
            );
          })}
          <button
            type="button"
            onClick={() => groups.forEach((g) => onChange(g.id, ""))}
            className="text-xs font-semibold text-brand-black/50 hover:text-brand-black"
          >
            Clear all
          </button>
        </div>
      )}

      {sheetOpen && (
        <div className="fixed inset-0 z-100 md:hidden">
          <div
            onClick={() => setSheetOpen(false)}
            aria-hidden="true"
            className="absolute inset-0 bg-brand-black/50"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-white p-5 shadow-lg">
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
            <div className="space-y-4">{renderFields()}</div>
          </div>
        </div>
      )}
    </div>
  );
}
