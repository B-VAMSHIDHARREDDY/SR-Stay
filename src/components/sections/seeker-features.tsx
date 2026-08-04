import Link from "next/link";
import { Search, Home, IndianRupee, Star, Phone, MapPin } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

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
    <section id="find-a-pg" className="bg-black/2 py-16 lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-black sm:text-4xl">
            Search, Compare & Move In — In Minutes
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/#cities"
            className="inline-block rounded-lg bg-brand-red px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark"
          >
            Search Best PG Near Me →
          </Link>
        </div>
      </div>
    </section>
  );
}
