"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const usps = [
  { feature: "Verified Listings", benefit: "No fake or outdated PGs" },
  { feature: "Zero Brokerage", benefit: "Save money, connect directly" },
  { feature: "Owner Dashboard", benefit: "Manage bookings & rent digitally" },
  { feature: "Dedicated Maintenance App", benefit: "Faster complaint resolution" },
  { feature: "City-wise Search", benefit: "Hyperlocal PG discovery" },
  { feature: "Simple, Fast UI", benefit: "Search & book in minutes" },
];

export function WhyChooseUs() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading>Why Choose SR Stays</SectionHeading>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2"
        >
          {usps.map((usp) => (
            <motion.div key={usp.feature} variants={staggerItem}>
              <Card padding="sm" className="flex h-full items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-brand-black">{usp.feature}</p>
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
