"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function Pagination({
  page,
  pageCount,
  onPageChange,
  className,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
}) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-full text-brand-black/60 transition-colors hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((p, i) => {
        const prev = pages[i - 1];
        const showGap = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {showGap && <span className="px-1 text-brand-black/40">…</span>}
            <button
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
                p === page ? "bg-gradient-ember text-white shadow-glow-red" : "text-brand-black/70 hover:bg-black/5",
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
        className="flex h-9 w-9 items-center justify-center rounded-full text-brand-black/60 transition-colors hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
