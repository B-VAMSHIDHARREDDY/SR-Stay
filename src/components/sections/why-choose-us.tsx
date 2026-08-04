import { CheckCircle2 } from "lucide-react";

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
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-black sm:text-4xl">
          Why Choose SR Stays
        </h2>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {usps.map((usp) => (
            <div
              key={usp.feature}
              className="flex items-start gap-3 rounded-xl border border-black/10 p-5"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" aria-hidden="true" />
              <div>
                <p className="font-semibold text-brand-black">{usp.feature}</p>
                <p className="mt-1 text-sm text-brand-black/60">{usp.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
