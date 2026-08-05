"use client";

import { motion } from "motion/react";
import { Building2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";

export function CityLocalitiesGrid({ localities, cityName }: { localities: string[]; cityName: string }) {
  return (
    <motion.div
      variants={bentoContainer}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {localities.map((locality) => (
        <motion.div key={locality} variants={bentoItem}>
          <Card hover padding="sm" className="h-full">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-ember-soft text-brand-red"
              aria-hidden="true"
            >
              <Building2 className="h-4 w-4" strokeWidth={2.25} />
            </div>
            <p className="font-display mt-3 font-semibold text-brand-black">
              PG in {locality}, {cityName}
            </p>
            <p className="mt-1 text-sm text-brand-black/55">
              Verified rooms with real photos & transparent pricing.
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
