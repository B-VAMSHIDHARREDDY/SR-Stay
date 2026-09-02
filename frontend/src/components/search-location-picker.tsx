"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin } from "lucide-react";
import { cities, type City } from "@/lib/cities";
import { Select, type SelectOption } from "@/components/ui/Select";
import { PgListingsSection } from "@/components/pg-listings-section";

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  county?: string;
  state_district?: string;
  state?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

/** Pseudo-value for the "All areas in <city>" locality option. */
const ALL_AREAS = "";

function getPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function matchCity(address: NominatimAddress): City | undefined {
  const candidates = [
    address.suburb,
    address.city,
    address.town,
    address.village,
    address.county,
    address.state_district,
    address.state,
  ]
    .filter((v): v is string => Boolean(v))
    .map((v) => v.toLowerCase());

  if (candidates.length === 0) return undefined;

  return cities.find((c) => {
    const names = [c.name.toLowerCase(), c.region.toLowerCase(), ...(c.aliases ?? [])];
    return candidates.some((cand) => names.some((name) => cand.includes(name) || name.includes(cand)));
  });
}

export function SearchLocationPicker() {
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  const [selectedLocality, setSelectedLocality] = useState<string>(cities[0].localities[0] ?? ALL_AREAS);
  const [userPicked, setUserPicked] = useState(false);

  const areaSelectRef = useRef<HTMLDivElement>(null);

  const scrollToResults = useCallback(() => {
    requestAnimationFrame(() => {
      document.getElementById("pg-listings")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const focusAreaSelect = useCallback(() => {
    requestAnimationFrame(() => {
      areaSelectRef.current?.querySelector<HTMLButtonElement>("[data-select-trigger]")?.focus();
    });
  }, []);

  useEffect(() => {
    // Silent background detection: pre-fills the city dropdown with the
    // user's current location. Never surfaced as its own UI (no "detecting…"
    // banner) — it just quietly upgrades the default selection once ready,
    // and only if the user hasn't already picked something themselves.
    if (userPicked) return;
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;

    let cancelled = false;

    getPosition({ timeout: 10000, maximumAge: 300000 })
      .then(async (position) => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14`,
          { headers: { Accept: "application/json" } },
        );
        if (!res.ok) throw new Error("Reverse geocoding failed");
        const data: NominatimResponse = await res.json();
        const match = matchCity(data.address ?? {});
        if (!cancelled && match) {
          setSelectedCity(match);
          setSelectedLocality(match.localities[0] ?? ALL_AREAS);
        }
      })
      .catch(() => {
        // Silent — the dropdowns already default to the first city/area.
      });

    return () => {
      cancelled = true;
    };
  }, [userPicked]);

  const cityOptions = useMemo<SelectOption[]>(() => cities.map((c) => ({ value: c.slug, label: c.name })), []);

  const localityOptions = useMemo<SelectOption[]>(
    () => [
      ...selectedCity.localities.map((l) => ({ value: l, label: l })),
      { value: ALL_AREAS, label: `All areas in ${selectedCity.name}` },
    ],
    [selectedCity],
  );

  function handleCityChange(slug: string) {
    const city = cities.find((c) => c.slug === slug);
    if (!city) return;
    setUserPicked(true);
    setSelectedCity(city);
    setSelectedLocality(city.localities[0] ?? ALL_AREAS);
    // Draw attention to the Area field next, rather than jumping straight to
    // results — the city alone doesn't mean the user is done narrowing down.
    focusAreaSelect();
  }

  function handleLocalityChange(value: string) {
    setUserPicked(true);
    setSelectedLocality(value);
    scrollToResults();
  }

  return (
    <>
      <section className="bg-mesh-light bg-grain relative py-8 sm:py-12">
        <div className="container-page relative z-10 max-w-2xl">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              aria-label="Back to home"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/8 bg-paper text-brand-black transition-colors hover:border-brand-red hover:text-brand-red"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
            <h1 className="font-display text-xl font-semibold tracking-tight text-brand-black sm:text-2xl">
              Where do you want to stay?
            </h1>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Select
              label="City"
              leadingIcon={<Building2 className="h-4 w-4" aria-hidden="true" />}
              options={cityOptions}
              value={selectedCity.slug}
              onChange={handleCityChange}
              searchable
              size="lg"
            />
            <div ref={areaSelectRef}>
              <Select
                label="Area"
                leadingIcon={<MapPin className="h-4 w-4" aria-hidden="true" />}
                options={localityOptions}
                value={selectedLocality}
                onChange={handleLocalityChange}
                searchable
                size="lg"
              />
            </div>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <PgListingsSection
          citySlug={selectedCity.slug}
          cityName={selectedCity.name}
          locality={selectedLocality || undefined}
        />
      </Suspense>
    </>
  );
}
