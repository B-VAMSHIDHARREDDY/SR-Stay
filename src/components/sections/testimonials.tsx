"use client";

import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";

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
    <section id="testimonials" className="bg-cream-deep py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Loved by residents & owners">What Our Users Say</SectionHeading>

        <motion.div
          variants={bentoContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div key={t.author} variants={bentoItem}>
              <Card hover className="h-full">
                <Quote className="h-7 w-7 text-brand-red/25" strokeWidth={2.5} aria-hidden="true" />
                <blockquote className="mt-3 text-sm leading-relaxed text-brand-black/75">
                  {t.quote}
                </blockquote>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-ember text-xs font-bold text-white">
                    {t.author.charAt(0)}
                  </span>
                  <p className="text-sm font-semibold text-brand-black">{t.author}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
