"use client";

import { motion } from "motion/react";
import { ClipboardList, LayoutDashboard, Banknote, Users, TrendingUp } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const features = [
  {
    icon: ClipboardList,
    title: "Easy PG Listing",
    description: "List your property in minutes — add rooms, photos, pricing & amenities.",
  },
  {
    icon: LayoutDashboard,
    title: "Owner Dashboard",
    description: "Track occupancy, enquiries, bookings, and tenant details in real time.",
  },
  {
    icon: Banknote,
    title: "Rent & Payment Tracking",
    description: "Digitally collect rent, send reminders, and view payment history.",
  },
  {
    icon: Users,
    title: "Tenant Management",
    description:
      "Maintain tenant records, agreements, ID proofs, and check-in/check-out dates.",
  },
  {
    icon: TrendingUp,
    title: "Better Visibility",
    description:
      "Get discovered by verified PG seekers searching in your locality — no third-party broker fees.",
  },
];

export function OwnerFeatures() {
  return (
    <section id="list-your-pg" className="bg-white py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading>Own a PG? Reach More Tenants, Manage Everything in One App</SectionHeading>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={staggerItem}>
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Button href="#download" variant="outline">
            List Your PG for Free →
          </Button>
        </div>
      </div>
    </section>
  );
}
