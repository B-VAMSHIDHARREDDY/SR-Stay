"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Search, Home, Star } from "lucide-react";
import { cities } from "@/lib/cities";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useCountUp } from "@/lib/use-count-up";

const trustStats = [
  { value: 10000, suffix: "+", label: "Verified PGs" },
  { value: 50000, suffix: "+", label: "Happy Residents" },
  { value: 20, suffix: "+", label: "Cities" },
  { value: 0, prefix: "₹", label: "Brokerage Fees" },
];

function StatChip({ value, prefix = "", suffix = "", label }: { value: number; prefix?: string; suffix?: string; label: string }) {
  const { ref, value: display } = useCountUp(value);
  return (
    <div ref={ref} className="rounded-2xl border border-black/8 bg-paper/70 px-4 py-3 backdrop-blur">
      <p className="font-display text-xl font-bold text-brand-black sm:text-2xl">
        {prefix}
        {display.toLocaleString("en-IN")}
        {suffix}
      </p>
      <p className="mt-0.5 text-xs font-medium text-brand-black/55">{label}</p>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [city, setCity] = useState(cities[0].slug);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/pg-in-${city}`);
  }

  return (
    <section id="hero" className="bg-mesh-light bg-grain relative overflow-hidden">
      <div className="container-page relative z-10 grid gap-14 py-14 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <span className="text-label inline-flex items-center gap-1.5 rounded-full bg-brand-red/8 px-3 py-1 font-semibold uppercase tracking-wide text-brand-red">
            Stay Comfort · Feel Home
          </span>
          <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.05] tracking-tight text-brand-black sm:text-h1">
            Find the best PG near you —{" "}
            <span className="text-gradient-ember">without the broker.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-brand-black/65">
            Search verified Paying Guest accommodations, compare prices, view real
            photos, and book your stay — all in one smooth app. Built for PG seekers, PG
            owners, and PG maintenance — together.
          </p>

          <form
            onSubmit={handleSearch}
            className="glass-panel mt-8 flex flex-col gap-2 rounded-3xl border border-black/8 p-2.5 shadow-lg transition-shadow duration-200 focus-within:shadow-xl sm:flex-row sm:items-center sm:rounded-full"
          >
            <div className="flex-1 sm:pl-2">
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
            <Button type="submit" className="rounded-full" icon={<Search className="h-4 w-4" strokeWidth={2.5} />}>
              Search PG
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/#find-a-pg">Find My PG</Button>
            <Button href="/#list-your-pg" variant="outline">
              List Your PG (For Owners)
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trustStats.map((stat) => (
              <StatChip key={stat.label} {...stat} />
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div
            className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-ember opacity-20 blur-3xl"
            aria-hidden="true"
          />
          <motion.div
            className="animate-float rounded-[2.5rem] border border-black/8 bg-paper p-4 shadow-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="overflow-hidden rounded-[1.75rem] bg-gradient-ink">
              <div className="flex items-center justify-between px-5 py-4">
                <span className="font-display text-sm font-semibold text-white">SR Stays</span>
                <span className="text-xs text-white/50">9:41</span>
              </div>
              <div className="space-y-3 bg-paper p-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-2xl border border-black/8 p-3 transition-shadow hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-ember-soft text-brand-red">
                      <Home className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2.5 w-3/4 rounded-full bg-brand-black/10" />
                      <div className="mt-2 h-2 w-1/2 rounded-full bg-brand-black/10" />
                    </div>
                    <span className="text-xs font-semibold text-brand-red">₹8,500</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="glass-panel absolute -right-4 -top-4 flex items-center gap-1.5 rounded-full border border-black/8 px-3.5 py-2 shadow-lg sm:-right-8"
          >
            <Star className="h-3.5 w-3.5 fill-amber text-amber" aria-hidden="true" />
            <span className="text-xs font-bold text-brand-black">4.6 rated</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
