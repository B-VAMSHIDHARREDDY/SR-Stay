import { Wrench, Receipt, CalendarDays, Bell, FileText } from "lucide-react";

const items = [
  {
    icon: Wrench,
    title: "Complaint & Service Requests",
    description:
      "Residents raise maintenance issues (electrical, plumbing, cleaning, WiFi, etc.) with photo upload & status tracking.",
  },
  {
    icon: Receipt,
    title: "Utility & Bill Management",
    description: "Track electricity, water, and other shared bills per room/floor.",
  },
  {
    icon: CalendarDays,
    title: "Housekeeping Schedule",
    description: "Owners assign and track cleaning and maintenance staff schedules.",
  },
  {
    icon: Bell,
    title: "Real-Time Notifications",
    description: "Residents and owners get instant updates on request status.",
  },
  {
    icon: FileText,
    title: "Maintenance History Log",
    description: "Full record of past repairs/services for transparency.",
  },
];

export function Maintenance() {
  return (
    <section id="maintenance" className="bg-brand-black py-16 text-white lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            PG Maintenance, Simplified — A Separate App Built Just for This
          </h2>
          <p className="mt-4 text-white/65">
            SR Stays offers a dedicated PG Maintenance application, separate from the main
            search app, so owners and residents can manage day-to-day PG operations smoothly.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/20 text-brand-red"
                aria-hidden="true"
              >
                <item.icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <h3 className="mt-4 text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="#download"
            className="inline-block rounded-lg bg-brand-red px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark"
          >
            Explore SR Stays Maintenance App →
          </a>
        </div>
      </div>
    </section>
  );
}
