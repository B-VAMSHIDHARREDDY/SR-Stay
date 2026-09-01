"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  LocateFixed,
  Loader2,
  MapPin,
  Search,
  TriangleAlert,
} from "lucide-react";
import { cities, type City } from "@/lib/cities";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PgListingsSection } from "@/components/pg-listings-section";
import { DURATION, EASE, fadeSlideDown, staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/cn";

type Browsing = { city: City; locality?: string };

type GeoStatus = "locating" | "matched" | "unmatched" | "denied" | "unsupported" | "error";

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

type SearchResult = { kind: "city"; city: City } | { kind: "locality"; city: City; locality: string };

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

const statusCopy: Record<GeoStatus, string> = {
  locating: "Detecting your location…",
  matched: "Detected near you",
  unmatched: "We're not in your area yet — pick a city below",
  denied: "Location access denied — tap to try again or pick a city below",
  unsupported: "Location isn't available on this device — pick a city below",
  error: "Couldn't detect your location — tap to try again",
};

/** How many localities/cities get the full icon-card treatment before the rest collapse into compact chips. */
const FEATURED_COUNT = 6;

/** Rich, tappable pick — used for the featured localities and for cities in the region grid. */
function PlaceCard({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={staggerItem}
      onClick={onClick}
      aria-pressed={active}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: DURATION.fast, ease: EASE }}
      className={cn(
        "flex items-center gap-2.5 rounded-2xl border p-3 text-left transition-colors",
        active
          ? "border-brand-red bg-brand-red/8"
          : "border-black/8 bg-paper hover:border-brand-red/40 hover:bg-black/[0.02]",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
          active ? "bg-gradient-ember text-white shadow-glow-red" : "bg-gradient-ember-soft text-brand-red",
        )}
      >
        <Building2 className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
      </span>
      <span className={cn("min-w-0 flex-1 truncate text-sm font-semibold", active ? "text-brand-red" : "text-brand-black")}>
        {label}
      </span>
      {active && <Check className="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />}
    </motion.button>
  );
}

/** Compact secondary pick — the "more areas" overflow and the region tab strip. */
function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={staggerItem}
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "border-brand-red bg-brand-red/8 text-brand-red"
          : "border-border bg-paper text-brand-black/75 hover:border-brand-red/40 hover:text-brand-red",
      )}
    >
      {label}
    </motion.button>
  );
}

export function SearchLocationPicker() {
  // Always starts "locating" so server and client render the same initial UI;
  // runDetection() corrects it to "unsupported" post-mount if geolocation isn't available.
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("locating");
  const [detectedLabel, setDetectedLabel] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [query, setQuery] = useState("");
  const [changeOpen, setChangeOpen] = useState(false);
  const [browsing, setBrowsing] = useState<Browsing | null>(null);
  const [showMoreAreas, setShowMoreAreas] = useState(false);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowMoreAreas(false);
  }, [selectedCity?.slug]);

  useEffect(() => {
    if (!browsing) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById("pg-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [browsing]);

  const runDetection = useCallback(async () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }

    try {
      const position = await getPosition({ timeout: 10000, maximumAge: 300000 });
      const { latitude, longitude } = position.coords;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14`,
        { headers: { Accept: "application/json" } },
      );
      if (!res.ok) throw new Error("Reverse geocoding failed");

      const data: NominatimResponse = await res.json();
      const address = data.address ?? {};
      const label = [address.suburb ?? address.city ?? address.town ?? address.village, address.state]
        .filter(Boolean)
        .join(", ");
      setDetectedLabel(label || data.display_name || null);

      const match = matchCity(address);
      if (match) {
        setSelectedCity(match);
        setGeoStatus("matched");
      } else {
        setGeoStatus("unmatched");
      }
    } catch (err) {
      const code = (err as GeolocationPositionError)?.code;
      setGeoStatus(code === 1 ? "denied" : "error");
    }
  }, []);

  useEffect(() => {
    // One-off browser geolocation request on mount, not a subscription — the
    // resulting setState calls only fire after the async permission/network round trip.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    runDetection();
  }, [runDetection]);

  function retryDetection() {
    setGeoStatus("locating");
    setDetectedLabel(null);
    runDetection();
  }

  const results = useMemo<SearchResult[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: SearchResult[] = [];
    for (const c of cities) {
      if (c.name.toLowerCase().includes(q) || c.region.toLowerCase().includes(q)) {
        out.push({ kind: "city", city: c });
      }
      for (const locality of c.localities) {
        if (locality.toLowerCase().includes(q)) {
          out.push({ kind: "locality", city: c, locality });
        }
      }
    }
    return out.slice(0, 20);
  }, [query]);

  const statesList = useMemo(() => {
    const map = new Map<string, City[]>();
    for (const c of cities) {
      const arr = map.get(c.region) ?? [];
      arr.push(c);
      map.set(c.region, arr);
    }
    return Array.from(map.entries());
  }, []);

  function chooseCity(city: City) {
    setSelectedCity(city);
    setQuery("");
    setChangeOpen(false);
    setActiveRegion(null);
    setBrowsing(null);
  }

  function chooseLocality(city: City, locality: string) {
    setSelectedCity(city);
    setQuery("");
    setBrowsing({ city, locality });
  }

  function browseCity(city: City) {
    setBrowsing({ city });
  }

  const showResults = query.trim().length > 0;
  const currentRegion = activeRegion ?? selectedCity?.region ?? statesList[0]?.[0] ?? null;
  const citiesInRegion = statesList.find(([region]) => region === currentRegion)?.[1] ?? [];

  return (
    <>
    <section className="bg-grain relative min-h-screen py-8 sm:py-12">
      <div aria-hidden="true" className="bg-mesh-light-bleed" />
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

        <div className="glass-panel mt-6 flex items-center gap-2 rounded-2xl border border-black/8 px-4 py-3 shadow-sm focus-within:border-brand-red">
          <Search className="h-4 w-4 shrink-0 text-brand-black/40" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for area, locality, or city…"
            className="w-full scroll-mt-28 bg-transparent text-sm text-brand-black outline-none placeholder:text-brand-black/40"
          />
        </div>

        <AnimatePresence mode="wait">
          {showResults ? (
            <motion.div
              key="results"
              variants={fadeSlideDown}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mt-3 space-y-1"
            >
              {results.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-brand-black/45">
                  No matches — try a different area or city name.
                </p>
              ) : (
                results.map((r) =>
                  r.kind === "city" ? (
                    <button
                      key={`city-${r.city.slug}`}
                      onClick={() => chooseCity(r.city)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-black/5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-ember-soft text-brand-red">
                        <Building2 className="h-4 w-4" strokeWidth={2.25} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-brand-black">{r.city.name}</span>
                        <span className="block text-xs text-brand-black/50">{r.city.region} · City</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-brand-black/25" aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      key={`loc-${r.city.slug}-${r.locality}`}
                      onClick={() => chooseLocality(r.city, r.locality)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors hover:bg-black/5"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-brand-black/60">
                        <MapPin className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-brand-black">{r.locality}</span>
                        <span className="block text-xs text-brand-black/50">{r.city.name}, {r.city.region}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 shrink-0 text-brand-black/25" aria-hidden="true" />
                    </button>
                  ),
                )
              )}
            </motion.div>
          ) : (
            <motion.div key="picker" variants={fadeSlideDown} initial="initial" animate="animate" exit="exit">
              <motion.button
                onClick={geoStatus === "locating" ? undefined : retryDetection}
                disabled={geoStatus === "locating"}
                whileHover={geoStatus === "locating" ? undefined : { y: -2 }}
                whileTap={geoStatus === "locating" ? undefined : { scale: 0.99 }}
                transition={{ duration: DURATION.fast, ease: EASE }}
                className={cn(
                  "mt-6 flex w-full items-center gap-3.5 rounded-2xl border px-4 py-4 text-left shadow-sm transition-colors disabled:cursor-default",
                  geoStatus === "matched"
                    ? "border-success/25 bg-success/5 hover:border-success/40"
                    : "border-black/8 bg-paper hover:border-brand-red/40",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                    geoStatus === "matched"
                      ? "bg-success/15 text-success-dark"
                      : "bg-gradient-ember-soft text-brand-red",
                  )}
                >
                  {geoStatus === "locating" ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  ) : geoStatus === "matched" ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : geoStatus === "denied" || geoStatus === "error" || geoStatus === "unsupported" ? (
                    <TriangleAlert className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <LocateFixed className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-brand-black">
                    {geoStatus === "matched" && selectedCity ? `Current location: ${selectedCity.name}` : "Use current location"}
                  </span>
                  <span className="block truncate text-xs text-brand-black/50">
                    {geoStatus === "matched" && detectedLabel ? detectedLabel : statusCopy[geoStatus]}
                  </span>
                </span>
                {geoStatus !== "locating" && geoStatus !== "matched" && (
                  <ChevronRight className="h-4 w-4 shrink-0 text-brand-black/30" aria-hidden="true" />
                )}
              </motion.button>

              {selectedCity && (
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="mt-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-label font-semibold uppercase tracking-wide text-brand-black/50">
                      Top areas in {selectedCity.name}
                    </h2>
                    <Badge variant="neutral">{selectedCity.region}</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                    {selectedCity.localities.slice(0, FEATURED_COUNT).map((locality) => (
                      <PlaceCard
                        key={locality}
                        label={locality}
                        active={
                          browsing?.city.slug === selectedCity.slug &&
                          browsing.locality?.toLowerCase() === locality.toLowerCase()
                        }
                        onClick={() => chooseLocality(selectedCity, locality)}
                      />
                    ))}
                  </div>

                  {selectedCity.localities.length > FEATURED_COUNT && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowMoreAreas((v) => !v)}
                        className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline"
                      >
                        {showMoreAreas
                          ? "Show fewer areas"
                          : `Show ${selectedCity.localities.length - FEATURED_COUNT} more areas`}
                        <motion.span animate={{ rotate: showMoreAreas ? 180 : 0 }} transition={{ duration: 0.15 }}>
                          <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {showMoreAreas && (
                          <motion.div
                            variants={fadeSlideDown}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="mt-3 flex flex-wrap gap-2"
                          >
                            {selectedCity.localities.slice(FEATURED_COUNT).map((locality) => (
                              <Chip
                                key={locality}
                                label={locality}
                                active={
                                  browsing?.city.slug === selectedCity.slug &&
                                  browsing.locality?.toLowerCase() === locality.toLowerCase()
                                }
                                onClick={() => chooseLocality(selectedCity, locality)}
                              />
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  <Button
                    onClick={() => browseCity(selectedCity)}
                    variant="outline"
                    icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                    iconPosition="right"
                    className="mt-4 w-full"
                  >
                    Search all of {selectedCity.name}
                  </Button>
                </motion.div>
              )}

              <div className="mt-6 border-t border-black/8 pt-4">
                <button
                  onClick={() => setChangeOpen((v) => !v)}
                  className="flex w-full items-center justify-between text-sm font-semibold text-brand-black/70 hover:text-brand-red"
                >
                  Change city or state
                  <motion.span animate={{ rotate: changeOpen ? 180 : 0 }} transition={{ duration: 0.15 }}>
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {(changeOpen || !selectedCity) && (
                    <motion.div
                      variants={fadeSlideDown}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="mt-4"
                    >
                      <div className="ui-scrollbar flex gap-2 overflow-x-auto pb-2">
                        {statesList.map(([region]) => (
                          <Chip
                            key={region}
                            label={region}
                            active={region === currentRegion}
                            onClick={() => setActiveRegion(region)}
                          />
                        ))}
                      </div>
                      <motion.div
                        key={currentRegion}
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="mt-3 grid grid-cols-2 gap-2.5"
                      >
                        {citiesInRegion.map((c) => (
                          <PlaceCard
                            key={c.slug}
                            label={c.name}
                            active={selectedCity?.slug === c.slug}
                            onClick={() => chooseCity(c)}
                          />
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>

    {browsing && (
      <div id="pg-results" className="scroll-mt-24">
        <div className="container-page flex justify-end pt-8">
          <button
            onClick={() => setBrowsing(null)}
            className="text-sm font-semibold text-brand-red hover:underline"
          >
            Change area
          </button>
        </div>
        <Suspense fallback={null}>
          <PgListingsSection citySlug={browsing.city.slug} cityName={browsing.city.name} locality={browsing.locality} />
        </Suspense>
      </div>
    )}
    </>
  );
}
