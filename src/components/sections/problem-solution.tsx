import { XCircle, CheckCircle2 } from "lucide-react";

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
    <section className="bg-white py-16 lg:py-24">
      <div className="container-page">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-black sm:text-4xl">
          Finding a Good PG Shouldn&apos;t Be This Hard
        </h2>

        <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-black/10">
          <div className="grid grid-cols-2 bg-brand-black text-sm font-semibold text-white">
            <div className="px-5 py-3">Old Way</div>
            <div className="px-5 py-3">With SR Stays</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.old}
              className={`grid grid-cols-2 text-sm ${i % 2 === 0 ? "bg-white" : "bg-black/2"}`}
            >
              <div className="flex items-start gap-2 border-r border-black/5 px-5 py-4 text-brand-black/60">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-brand-black/30" aria-hidden="true" />
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
