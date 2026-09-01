import { apiFetch } from "@/lib/api";
import type { PGListing, PGListingInput, PGSearchResponse } from "@/lib/types";

export type SortOption = "newest" | "price_asc" | "price_desc";

export type SearchPgsParams = {
  city?: string;
  locality?: string;
  q?: string;
  gender?: string;
  min_price?: number;
  max_price?: number;
  sharing_type?: string;
  amenities?: string[];
  sort?: SortOption;
  page?: number;
  page_size?: number;
};

type QueryValue = string | number | string[] | undefined;

function toQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    if (Array.isArray(value)) {
      for (const v of value) search.append(key, v);
    } else {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function searchPgs(params: SearchPgsParams): Promise<PGSearchResponse> {
  return apiFetch<PGSearchResponse>(`/api/pgs${toQueryString(params)}`);
}

export function listAdminPgs(city?: string): Promise<PGListing[]> {
  return apiFetch<PGListing[]>(`/api/admin/pgs${toQueryString({ city })}`, { auth: true });
}

export function createPg(payload: PGListingInput): Promise<PGListing> {
  return apiFetch<PGListing>("/api/admin/pgs", { method: "POST", body: payload, auth: true });
}

export function updatePg(id: string, payload: Partial<PGListingInput>): Promise<PGListing> {
  return apiFetch<PGListing>(`/api/admin/pgs/${id}`, { method: "PUT", body: payload, auth: true });
}

export function deletePg(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/pgs/${id}`, { method: "DELETE", auth: true });
}
