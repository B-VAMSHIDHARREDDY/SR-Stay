import { apiFetch } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

export function listUsers(): Promise<UserProfile[]> {
  return apiFetch<UserProfile[]>("/api/admin/users", { auth: true });
}
