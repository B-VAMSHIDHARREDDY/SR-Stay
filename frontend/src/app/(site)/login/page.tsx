"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchMe, loginWithPhone } from "@/lib/user-auth";
import { ApiError } from "@/lib/api";
import { siteConfig } from "@/lib/site-config";

const PHONE_LENGTH = 10;
const PHONE_PATTERN = /^\d{10}$/;

function describeError(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      return "Our servers are having trouble right now. Please try again in a moment.";
    }
    if (err.status === 422) {
      return "Enter a valid 10-digit phone number.";
    }
    return typeof err.message === "string" && err.message ? err.message : "Something went wrong. Try again.";
  }
  return "Can't reach the server. Check your connection and try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMe().then((user) => {
      if (cancelled) return;
      if (user) {
        router.replace("/account");
      } else {
        setChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, PHONE_LENGTH);
    setPhone(digitsOnly);
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!PHONE_PATTERN.test(phone)) {
      setError("Enter a valid 10-digit phone number");
      return;
    }

    setSubmitting(true);
    try {
      await loginWithPhone(phone);
      router.replace("/account");
    } catch (err) {
      setError(describeError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <section className="bg-grain relative flex min-h-screen items-center justify-center">
        <div aria-hidden="true" className="bg-mesh-light-bleed" />
        <Loader2 className="relative z-10 h-6 w-6 animate-spin text-brand-red" aria-hidden="true" />
      </section>
    );
  }

  return (
    <section className="bg-grain relative flex min-h-screen items-center justify-center px-4 py-12">
      <div aria-hidden="true" className="bg-mesh-light-bleed" />
      <div className="relative z-10 w-full max-w-sm">
        <Card padding="lg">
          <h1 className="font-display text-xl font-semibold tracking-tight text-brand-black">Log in</h1>
          <p className="mt-1 text-sm text-brand-black/55">
            Enter your phone number to continue — no password needed.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <Input
              label="Phone number"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="98765 43210"
              required
              prefix="+91"
              value={phone}
              onChange={handlePhoneChange}
              error={error ?? undefined}
              helperText={error ? undefined : "First time here? We'll create your account automatically."}
            />
            <Button type="submit" className="w-full" loading={submitting} disabled={phone.length !== PHONE_LENGTH}>
              Continue
            </Button>
          </form>
        </Card>

        <p className="mt-4 text-center text-xs text-brand-black/45">
          Listing a PG?{" "}
          <a href="/admin-login" className="font-medium text-brand-black/70 underline-offset-2 hover:underline">
            Sign in as an owner
          </a>
        </p>
        <p className="mt-1 text-center text-xs text-brand-black/45">
          Trouble logging in?{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="font-medium text-brand-black/70 underline-offset-2 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </section>
  );
}
