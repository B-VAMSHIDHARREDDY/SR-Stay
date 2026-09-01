import { apiFetch } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

const TOKEN_KEY = "sr_user_token";

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

export async function loginWithPhone(phone: string): Promise<void> {
  const res = await apiFetch<TokenResponse>("/api/users/login", {
    method: "POST",
    body: { phone },
  });
  setToken(res.access_token);
}

export async function fetchMe(): Promise<UserProfile | null> {
  const token = getToken();
  if (!token) return null;
  try {
    return await apiFetch<UserProfile>("/api/users/me", { token });
  } catch {
    clearToken();
    return null;
  }
}

export async function updateMe(
  data: Partial<Pick<UserProfile, "name" | "email" | "gender">>,
): Promise<UserProfile> {
  const token = getToken();
  return apiFetch<UserProfile>("/api/users/me", {
    method: "PATCH",
    body: data,
    token: token ?? undefined,
  });
}

export function logout(): void {
  clearToken();
}
