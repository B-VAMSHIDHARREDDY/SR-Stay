import { apiFetch } from "@/lib/api";
import type { AdminUser } from "@/lib/types";

const TOKEN_KEY = "sr_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function login(email: string, password: string): Promise<void> {
  const res = await apiFetch<TokenResponse>("/api/admin/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(res.access_token);
}

export async function fetchMe(): Promise<AdminUser | null> {
  if (!getToken()) return null;
  try {
    return await apiFetch<AdminUser>("/api/admin/me", { auth: true });
  } catch {
    clearToken();
    return null;
  }
}

export function logout(): void {
  clearToken();
}
