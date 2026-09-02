"use client";

import { useEffect, useState } from "react";
import { listAmenities } from "@/lib/pg-api";
import type { Amenity } from "@/lib/types";

/** Live amenities list from the backend, used to drive both the admin
 * add/edit-PG form and the public search filters from one source of truth. */
export function useAmenities(): { amenities: Amenity[]; loading: boolean } {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listAmenities()
      .then((data) => {
        if (!cancelled) setAmenities(data);
      })
      .catch(() => {
        // Silent — callers just see an empty list if this fails.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { amenities, loading };
}
