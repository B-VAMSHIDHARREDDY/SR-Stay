"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { MapPin, Search, CheckCircle2, Home } from "lucide-react";
import { cities } from "@/lib/cities";

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
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brand-black sm:text-5xl">
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
            <label className="sr-only" htmlFor="city-select">
              City / locality
            </label>
            <div className="flex flex-1 items-center gap-2 px-2">
              <MapPin className="h-4 w-4 text-brand-red" aria-hidden="true" />
              <select
                id="city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent py-2 text-sm text-brand-black outline-none"
              >
                {cities.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden h-8 w-px bg-black/10 sm:block" aria-hidden="true" />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
              Search PG
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/#find-a-pg"
              className="rounded-lg bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark"
            >
              Find My PG
            </Link>
            <Link
              href="/#list-your-pg"
              className="rounded-lg border-2 border-brand-black px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white"
            >
              List Your PG (For Owners)
            </Link>
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
