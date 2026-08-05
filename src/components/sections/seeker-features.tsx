"use client";

import { motion } from "motion/react";
import { Search, Home, IndianRupee, Star, Phone, MapPin } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { bentoContainer, bentoItem, viewportOnce } from "@/lib/motion";

const features = [
  {
    icon: Search,
    title: "Smart PG Search",
    description:
      "Search PGs by locality, gender preference (men/women/co-living), budget, and amenities.",
  },
  {
    icon: Home,
    title: "Verified Listings",
    description:
      "Every PG on SR Stays is verified with real photos, room types (single/double/triple sharing), and accurate pricing.",
  },
  {
    icon: IndianRupee,
    title: "Transparent Pricing",
    description:
      "No hidden charges. See rent, deposit, and included amenities (WiFi, food, laundry, AC, parking) upfront.",
  },
  {
    icon: Star,
    title: "Ratings & Reviews",
    description: "Read genuine reviews from current and past PG residents before you decide.",
  },
  {
    icon: Phone,
    title: "Direct Contact / Book a Visit",
    description:
      "Contact the PG owner directly or schedule a visit — zero brokerage, zero middlemen.",
  },
  {
    icon: MapPin,
    title: "Map-Based Discovery",
    description: "Find PGs near your office, college, or metro station using live map search.",
  },
];

export function SeekerFeatures() {
  return (
    <section id="find-a-pg" className="bg-cream py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="For PG seekers">Search, Compare & Move In — In Minutes</SectionHeading>

        <motion.div
          variants={bentoContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f, i) => (
            <motion.div key={f.title} variants={bentoItem} className={i === 0 ? "sm:col-span-2" : undefined}>
              <FeatureCard {...f} tone={i === 0 ? "gradient" : "light"} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Button href="/#cities">Search Best PG Near Me →</Button>
        </div>
      </div>
    </section>
  );
}
