import { cities, type City } from "@/lib/cities";

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

/** Silently resolves to the user's current city via browser geolocation +
 * reverse geocoding, or `undefined` if unavailable/denied/unmatched. Never
 * throws — callers should just keep whatever default they already show. */
export async function detectCurrentCity(): Promise<City | undefined> {
  if (typeof navigator === "undefined" || !("geolocation" in navigator)) return undefined;

  try {
    const position = await getPosition({ timeout: 10000, maximumAge: 300000 });
    const { latitude, longitude } = position.coords;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14`,
      { headers: { Accept: "application/json" } },
    );
    if (!res.ok) return undefined;
    const data: NominatimResponse = await res.json();
    return matchCity(data.address ?? {});
  } catch {
    return undefined;
  }
}
