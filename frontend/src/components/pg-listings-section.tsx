"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { IndianRupee, MapPin, Phone, TriangleAlert, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
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
                  <Card hover padding="sm" className="flex h-full flex-col">
                    <div
                      className="h-32 w-full rounded-xl bg-gradient-ember-soft bg-cover bg-center"
                      style={pg.images[0] ? { backgroundImage: `url(${pg.images[0]})` } : undefined}
                    />
                    <div className="mt-4 flex items-start justify-between gap-2">
                      <p className="font-display font-semibold text-brand-black">{pg.name}</p>
                      <Badge variant="neutral" className="shrink-0 capitalize">
                        {pg.gender}
                      </Badge>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-sm text-brand-black/55">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {pg.locality}, {cityName}
                    </p>

                    {pg.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {pg.amenities.slice(0, 4).map((a) => (
                          <Badge key={a} variant="brand" className="!px-2 !py-1 text-[11px]">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/8 pt-3">
                      <p className="flex items-center font-display font-semibold text-brand-black">
                        <IndianRupee className="h-3.5 w-3.5" aria-hidden="true" />
                        {pg.price_monthly.toLocaleString("en-IN")}
                        <span className="ml-1 text-xs font-normal text-brand-black/50">/mo</span>
                      </p>
                      {pg.sharing_types.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-brand-black/50">
                          <Users className="h-3.5 w-3.5" aria-hidden="true" />
                          {pg.sharing_types.join(" / ")}
                        </span>
                      )}
                    </div>

                    <a
                      href={`tel:${pg.contact_phone}`}
                      className="mt-3 flex items-center justify-center gap-1.5 rounded-full bg-gradient-ember py-2.5 text-sm font-semibold text-white shadow-glow-red transition-[filter] hover:brightness-110"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                      Contact Owner
                    </a>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <Pagination page={page} pageCount={pageCount} onPageChange={setPage} className="mt-8" />
          </>
        )}
      </div>
    </section>
  );
}
