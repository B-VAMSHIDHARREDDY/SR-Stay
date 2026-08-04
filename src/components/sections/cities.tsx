"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { cities } from "@/lib/cities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

export function Cities() {
  return (
    <section id="cities" className="bg-white py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading description="Explore verified PGs in your city with hyperlocal search and real pricing.">
          Best PG Accommodations Across India
        </SectionHeading>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cities.map((city) => (
            <motion.div key={city.slug} variants={staggerItem}>
              <Link
                href={`/pg-in-${city.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:border-brand-red hover:shadow-md"
              >
                <div>
                  <p className="font-semibold text-brand-black group-hover:text-brand-red">
                    PG in {city.name}
                  </p>
                  <p className="text-xs text-brand-black/50">{city.pgCount} verified PGs</p>
                </div>
                <span
                  className="text-brand-red transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
