import { ClipboardList, LayoutDashboard, Banknote, Users, TrendingUp } from "lucide-react";
import { FeatureCard } from "@/components/feature-card";

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
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-brand-black sm:text-4xl">
            Own a PG? Reach More Tenants, Manage Everything in One App
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#download"
            className="inline-block rounded-lg border-2 border-brand-black px-7 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white"
          >
            List Your PG for Free →
          </a>
        </div>
      </div>
    </section>
  );
}
