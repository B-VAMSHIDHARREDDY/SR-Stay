"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const tracks = [
  {
    title: "For PG Seekers",
    steps: ["Search your locality", "Compare verified PGs", "Visit / Book", "Move In"],
  },
  {
    title: "For PG Owners",
    steps: ["List your PG (Free)", "Get verified", "Receive enquiries", "Manage via dashboard"],
  },
  {
    title: "For Maintenance",
    steps: ["Raise a request", "Owner/staff notified", "Track status", "Resolved & logged"],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-muted py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading>How It Works</SectionHeading>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-8 lg:grid-cols-3"
        >
          {tracks.map((track) => (
            <motion.div key={track.title} variants={staggerItem}>
              <Card className="h-full">
                <h3 className="text-h4 font-bold text-brand-black">{track.title}</h3>
                <ol className="mt-5 space-y-4">
                  {track.steps.map((step, i) => (
                    <li key={step} className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm text-brand-black/75">{step}</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
