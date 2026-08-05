"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/cn";

const tracks = [
  {
    title: "For PG Seekers",
    accent: "bg-gradient-ember",
    steps: ["Search your locality", "Compare verified PGs", "Visit / Book", "Move In"],
  },
  {
    title: "For PG Owners",
    accent: "bg-gradient-ink",
    steps: ["List your PG (Free)", "Get verified", "Receive enquiries", "Manage via dashboard"],
  },
  {
    title: "For Maintenance",
    accent: "bg-amber",
    steps: ["Raise a request", "Owner/staff notified", "Track status", "Resolved & logged"],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream-deep py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Simple by design">How It Works</SectionHeading>

        <motion.div
          variants={bentoContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-6 lg:grid-cols-3"
        >
          {tracks.map((track) => (
            <motion.div key={track.title} variants={bentoItem}>
              <Card hover className="h-full">
                <h3 className="font-display text-h4 font-bold text-brand-black">{track.title}</h3>
                <ol className="relative mt-6 space-y-5">
                  <span
                    aria-hidden="true"
                    className="absolute top-3 bottom-3 left-3.5 w-px bg-border"
                  />
                  {track.steps.map((step, i) => (
                    <li key={step} className="relative flex items-center gap-3">
                      <span
                        className={cn(
                          "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm",
                          track.accent,
                        )}
                      >
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
