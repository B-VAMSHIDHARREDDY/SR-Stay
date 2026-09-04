"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { PgCard } from "@/components/pg-card";
import { PgDetailModal } from "@/components/pg-detail-modal";
import { BUDGET_PRESETS, DEFAULT_PG_FILTERS, PgFiltersBar, type PgFiltersValue } from "@/components/pg-filters-bar";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";
import { searchPgs } from "@/lib/pg-api";
import type { PGListing } from "@/lib/types";

const PAGE_SIZE = 9;

export function PgListingsSection({
  citySlug,
  cityName,
  locality: localityProp,
}: {
  citySlug: string;
  cityName: string;
  /** Explicit locality filter. When omitted, falls back to the `?locality=` URL param. */
  locality?: string;
}) {
  const localityFromUrl = useSearchParams().get("locality") ?? undefined;
  const locality = localityProp ?? localityFromUrl;

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<PgFiltersValue>(DEFAULT_PG_FILTERS);
  const [items, setItems] = useState<PGListing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errored, setErrored] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [selectedPg, setSelectedPg] = useState<PGListing | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [locality, filters]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setErrored(false);

    const budget = BUDGET_PRESETS.find((b) => b.id === filters.budget);

    searchPgs({
      city: citySlug,
      locality,
      page,
      page_size: PAGE_SIZE,
      gender: filters.gender || undefined,
      min_price: budget?.min,
      max_price: budget?.max,
      sharing_type: filters.sharingType || undefined,
      amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
      sort: filters.sort,
    })
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
      })
      .catch(() => {
        if (!cancelled) setErrored(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [citySlug, locality, page, filters, retryKey]);

  const pageCount = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);
  const hasActiveFilters =
    filters.gender !== "" || filters.budget !== "" || filters.sharingType !== "" || filters.amenities.length > 0;

  return (
    <section id="pg-listings" className="scroll-mt-24 bg-paper py-14">
      <div className="container-page">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-h2 font-semibold tracking-tight text-brand-black">
            {locality ? `PGs in ${locality}, ${cityName}` : `Available PGs in ${cityName}`}
          </h2>
          {!loading && total > 0 && (
            <span className="text-sm text-brand-black/55">
              {total} listing{total === 1 ? "" : "s"}
            </span>
          )}
        </div>

        <PgFiltersBar value={filters} onChange={setFilters} resultCount={total} className="mt-5" />

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} padding="sm">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="mt-4 h-4 w-2/3" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </Card>
            ))}
          </div>
        ) : errored ? (
          <EmptyState
            icon={TriangleAlert}
            className="mt-6"
            title="Couldn't load listings"
            description="We're having trouble reaching our servers. Please check your connection and try again."
            action={{ label: "Try again", onClick: () => setRetryKey((k) => k + 1) }}
          />
        ) : items.length === 0 ? (
          <EmptyState
            className="mt-6"
            title="No PGs found here yet"
            description={
              hasActiveFilters
                ? "No listings match your filters. Try loosening them to see more PGs."
                : "Try a different locality, or check back soon — new listings are added regularly."
            }
            action={hasActiveFilters ? { label: "Clear filters", onClick: () => setFilters(DEFAULT_PG_FILTERS) } : undefined}
          />
        ) : (
          <>
            <motion.div
              variants={bentoContainer}
              initial="initial"
              whileInView="animate"
              viewport={viewportOnce}
              className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {items.map((pg) => (
                <motion.div key={pg.id} variants={bentoItem}>
                  <PgCard pg={pg} cityName={cityName} onOpen={setSelectedPg} />
                </motion.div>
              ))}
            </motion.div>

            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </div>

      <PgDetailModal pg={selectedPg} cityName={cityName} onClose={() => setSelectedPg(null)} />
    </section>
  );
}
