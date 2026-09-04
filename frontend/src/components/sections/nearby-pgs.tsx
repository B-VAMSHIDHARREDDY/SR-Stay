"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { PgCard } from "@/components/pg-card";
import { PgDetailModal } from "@/components/pg-detail-modal";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";
import { cities, type City } from "@/lib/cities";
import { detectCurrentCity } from "@/lib/detect-city";
import { searchPgs } from "@/lib/pg-api";
import type { PGListing } from "@/lib/types";

const PREVIEW_COUNT = 6;

export function NearbyPgs() {
  const [city, setCity] = useState<City>(cities[0]);
  const [detected, setDetected] = useState(false);
  const [items, setItems] = useState<PGListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPg, setSelectedPg] = useState<PGListing | null>(null);

  useEffect(() => {
    let cancelled = false;
    detectCurrentCity().then((match) => {
      if (!cancelled && match) {
        setCity(match);
        setDetected(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    searchPgs({ city: city.slug, page: 1, page_size: PREVIEW_COUNT, sort: "newest" })
      .then((res) => {
        if (!cancelled) setItems(res.items);
      })
      .catch(() => {
        // Silent — this is a homepage preview widget, not the core search
        // flow. If it fails to load, the section just stays empty rather
        // than breaking the rest of the homepage.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [city]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="bg-paper py-16 lg:py-20">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-label flex items-center gap-1.5 font-semibold uppercase tracking-wide text-brand-red">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {detected ? "Near you" : "Popular right now"}
            </p>
            <h2 className="font-display mt-1 text-h2 font-semibold tracking-tight text-brand-black">PGs in {city.name}</h2>
          </div>
          <Button
            href="/search"
            variant="outline"
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            iconPosition="right"
          >
            View all PGs
          </Button>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
              <Card key={i} padding="sm">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="mt-4 h-4 w-2/3" />
                <Skeleton className="mt-2 h-3 w-1/2" />
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            variants={bentoContainer}
            initial="initial"
            whileInView="animate"
            viewport={viewportOnce}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((pg) => (
              <motion.div key={pg.id} variants={bentoItem}>
                <PgCard pg={pg} cityName={city.name} onOpen={setSelectedPg} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <PgDetailModal pg={selectedPg} cityName={city.name} onClose={() => setSelectedPg(null)} />
    </section>
  );
}
