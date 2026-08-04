import { Wrench, Receipt, CalendarDays, Bell, FileText } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
        <SectionHeading
          tone="light"
          description="SR Stays offers a dedicated PG Maintenance application, separate from the main search app, so owners and residents can manage day-to-day PG operations smoothly."
        >
          PG Maintenance, Simplified — A Separate App Built Just for This
        </SectionHeading>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.title} tone="dark">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/20 text-brand-red"
                aria-hidden="true"
              >
                <item.icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <h3 className="text-h4 mt-4 font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{item.description}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button href="#download">Explore SR Stays Maintenance App →</Button>
        </div>
      </div>
    </section>
  );
}
