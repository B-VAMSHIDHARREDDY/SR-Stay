"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

const usps = [
  { feature: "Verified Listings", benefit: "No fake or outdated PGs" },
  { feature: "Zero Brokerage", benefit: "Save money, connect directly" },
  { feature: "Owner Dashboard", benefit: "Manage bookings & rent digitally" },
  { feature: "Dedicated Maintenance App", benefit: "Faster complaint resolution" },
  { feature: "City-wise Search", benefit: "Hyperlocal PG discovery" },
  { feature: "Simple, Fast UI", benefit: "Search & book in minutes" },
];

const accents = ["bg-gradient-ember-soft text-brand-red", "bg-plum/8 text-plum", "bg-amber/12 text-amber"];

export function WhyChooseUs() {
  return (
    <section className="bg-paper py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Why SR Stays">Why Choose SR Stays</SectionHeading>

        <motion.div
          variants={bentoContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2"
        >
          {usps.map((usp, i) => (
            <motion.div key={usp.feature} variants={bentoItem}>
              <Card hover padding="sm" className="flex h-full items-start gap-3.5">
                <span
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    accents[i % accents.length],
                  )}
                >
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display font-semibold text-brand-black">{usp.feature}</p>
                  <p className="mt-1 text-sm text-brand-black/60">{usp.benefit}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
