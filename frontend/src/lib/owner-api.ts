import { apiFetch } from "@/lib/api";
import type { Owner, OwnerInput } from "@/lib/types";

export function listOwners(): Promise<Owner[]> {
  return apiFetch<Owner[]>("/api/admin/owners", { auth: true });
}

export function createOwner(payload: OwnerInput): Promise<Owner> {
  return apiFetch<Owner>("/api/admin/owners", { method: "POST", body: payload, auth: true });
}

export function updateOwner(id: string, payload: Partial<OwnerInput>): Promise<Owner> {
  return apiFetch<Owner>(`/api/admin/owners/${id}`, { method: "PUT", body: payload, auth: true });
}

export function deleteOwner(id: string): Promise<void> {
  return apiFetch<void>(`/api/admin/owners/${id}`, { method: "DELETE", auth: true });
}
