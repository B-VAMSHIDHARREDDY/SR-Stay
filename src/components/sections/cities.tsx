"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";
import { cities } from "@/lib/cities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";

export function Cities() {
  return (
    <section id="cities" className="bg-cream py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="20+ cities"
          description="Explore verified PGs in your city with hyperlocal search and real pricing."
        >
          Best PG Accommodations Across India
        </SectionHeading>

        <motion.div
          variants={bentoContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cities.map((city) => (
            <motion.div key={city.slug} variants={bentoItem}>
              <Link
                href={`/pg-in-${city.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-paper px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-ember-soft text-brand-red">
                  <MapPin className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-brand-black group-hover:text-brand-red">
                    PG in {city.name}
                  </p>
                  <p className="text-xs text-brand-black/50">{city.pgCount} verified PGs</p>
                </div>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-brand-black/30 transition-all group-hover:translate-x-1 group-hover:text-brand-red"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
