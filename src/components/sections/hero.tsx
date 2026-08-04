"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Search, CheckCircle2, Home } from "lucide-react";
import { cities } from "@/lib/cities";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

const trustStats = [
  "10,000+ Verified PGs",
  "50,000+ Happy Residents",
  "Zero Brokerage",
  "Available in 20+ Cities",
];

export function Hero() {
  const router = useRouter();
  const [city, setCity] = useState(cities[0].slug);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/pg-in-${city}`);
  }

  return (
    <section id="hero" className="relative overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-red/5"
        aria-hidden="true"
      />
      <div className="container-page relative grid gap-12 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brand-black sm:text-h1">
            Find the Best PG Near You — <span className="text-brand-red">Stay Comfort, Feel Home</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-black/70">
            Search verified Paying Guest (PG) accommodations, compare prices, view real
            photos, and book your stay — all in one smooth app. Built for PG seekers, PG
            owners, and PG maintenance — together.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex-1">
              <Select
                label="City / locality"
                hideLabel
                bare
                leadingIcon={<MapPin className="h-4 w-4" />}
                options={cities.map((c) => ({ value: c.slug, label: c.name }))}
                value={city}
                onChange={setCity}
              />
            </div>
            <div className="hidden h-8 w-px bg-black/10 sm:block" aria-hidden="true" />
            <Button type="submit" icon={<Search className="h-4 w-4" strokeWidth={2.5} />}>
              Search PG
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/#find-a-pg">Find My PG</Button>
            <Button href="/#list-your-pg" variant="outline">
              List Your PG (For Owners)
            </Button>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {trustStats.map((stat) => (
              <div key={stat} className="flex items-center gap-1.5 text-sm font-medium text-brand-black/80">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                {stat}
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-brand-red/5" aria-hidden="true" />
          <div className="rounded-[2.5rem] border border-black/10 bg-white p-4 shadow-xl">
            <div className="overflow-hidden rounded-3xl bg-brand-black">
              <div className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-semibold text-white">SR Stays</span>
                <span className="text-xs text-white/60">9:41</span>
              </div>
              <div className="space-y-3 bg-white p-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-black/10 p-3"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                      <Home className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-3/4 rounded bg-brand-black/10" />
                      <div className="mt-2 h-2 w-1/2 rounded bg-brand-black/10" />
                    </div>
                    <span className="text-xs font-semibold text-brand-red">₹8,500</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
