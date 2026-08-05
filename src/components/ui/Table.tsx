"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";
import { DURATION, EASE } from "@/lib/motion";
import { Skeleton } from "./Skeleton";
import { EmptyState } from "./EmptyState";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function Table<T extends { id: string | number }>({
  columns,
  data,
  loading = false,
  skeletonRows = 5,
  emptyTitle = "No results",
  emptyDescription,
  className,
}: {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-paper shadow-sm", className)}>
      <div className="ui-scrollbar max-h-[28rem] overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-surface-muted">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="border-b border-border px-5 py-3 text-left text-xs font-semibold tracking-wide text-brand-black/55 uppercase"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout" initial={false}>
              {loading
                ? Array.from({ length: skeletonRows }).map((_, i) => (
                    <motion.tr
                      key={`skeleton-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: DURATION.fast, ease: EASE }}
                      className="border-b border-border last:border-0"
                    >
                      {columns.map((col) => (
                        <td key={col.key} className="px-5 py-4">
                          <Skeleton className="h-4 w-full max-w-40" />
                        </td>
                      ))}
                    </motion.tr>
                  ))
                : data.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: DURATION.base, ease: EASE, delay: Math.min(i, 8) * 0.03 }}
                      className="border-b border-border transition-colors last:border-0 hover:bg-surface-muted"
                    >
                      {columns.map((col) => (
                        <td key={col.key} className={cn("px-5 py-4 text-brand-black/80", col.className)}>
                          {col.render(row)}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {!loading && data.length === 0 && (
        <div className="p-10">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      )}
    </div>
  );
}
