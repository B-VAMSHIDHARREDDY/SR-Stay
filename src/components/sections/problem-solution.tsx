import { XCircle, CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

const rows = [
  { old: "Broker calls & fake listings", withUs: "100% verified PG listings" },
  { old: "No photos or wrong info", withUs: "Real photos, amenities & pricing" },
  {
    old: "No easy way to raise complaints",
    withUs: "Dedicated PG Maintenance app",
  },
  {
    old: "Owners manage everything on paper/WhatsApp",
    withUs: "Owner dashboard for bookings, rent & tenants",
  },
  { old: "No price comparison", withUs: "Compare PGs side-by-side instantly" },
];

export function ProblemSolution() {
  return (
    <section className="bg-cream py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="The old way, fixed">
          Finding a Good PG Shouldn&apos;t Be This Hard
        </SectionHeading>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-4xl border border-border shadow-sm">
          <div className="bg-gradient-ink grid grid-cols-2 text-sm font-semibold text-white">
            <div className="font-display px-5 py-4">Old Way</div>
            <div className="font-display px-5 py-4">With SR Stays</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.old}
              className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? "bg-paper" : "bg-cream"}`}
            >
              <div className="flex items-start gap-2 border-r border-border px-5 py-4 text-brand-black/55">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-black/25" aria-hidden="true" />
                {row.old}
              </div>
              <div className="flex items-start gap-2 px-5 py-4 font-medium text-brand-black">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                {row.withUs}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
