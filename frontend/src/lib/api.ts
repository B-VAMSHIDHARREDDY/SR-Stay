import { apiBaseUrl } from "@/lib/env";
import { getToken } from "@/lib/admin-auth";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Attaches the admin token via `admin-auth`'s getToken(). Ignored when `token` is set. */
  auth?: boolean;
  /** Explicit bearer token to attach — takes precedence over `auth`. */
  token?: string;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { body, auth = false, token, headers, ...rest } = options;

  const finalHeaders: HeadersInit = { "Content-Type": "application/json", ...headers };

  const bearerToken = token ?? (auth ? getToken() : null);
  if (bearerToken) {
    (finalHeaders as Record<string, string>).Authorization = `Bearer ${bearerToken}`;
  }

  const res = await fetch(`${apiBaseUrl}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const data = await res.json();
      message = data.detail ?? message;
    } catch {
      // response had no JSON body
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
