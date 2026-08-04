"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const testimonials = [
  {
    quote:
      "I found a verified PG near my office in Madhapur within a day — no broker calls, no confusion.",
    author: "Resident, Hyderabad",
  },
  {
    quote:
      "Managing tenants and rent used to be a headache. SR Stays owner dashboard made it effortless.",
    author: "PG Owner, Hyderabad",
  },
  {
    quote: "The maintenance app is a lifesaver — I raise a complaint and it's fixed within hours.",
    author: "Resident, Bangalore",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-surface-muted py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading>What Our Users Say</SectionHeading>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.author} variants={staggerItem}>
              <Card>
                <blockquote className="text-sm leading-relaxed text-brand-black/75">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <p className="mt-4 text-sm font-semibold text-brand-red">— {t.author}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
