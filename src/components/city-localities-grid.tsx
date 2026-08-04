"use client";

import { motion } from "motion/react";
import { Card } from "@/components/ui/Card";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

export function CityLocalitiesGrid({ localities, cityName }: { localities: string[]; cityName: string }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
      className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {localities.map((locality) => (
        <motion.div key={locality} variants={staggerItem}>
          <Card padding="sm" className="h-full">
            <p className="font-semibold text-brand-black">
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
