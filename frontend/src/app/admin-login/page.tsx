"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchMe, login } from "@/lib/admin-auth";
import { ApiError } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchMe().then((admin) => {
      if (cancelled) return;
      if (admin) {
        router.replace("/admin");
      } else {
        setChecking(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
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
      <Card className="relative z-10 w-full max-w-sm" padding="lg">
        <h1 className="font-display text-xl font-semibold tracking-tight text-brand-black">Admin sign in</h1>
        <p className="mt-1 text-sm text-brand-black/55">Sign in to manage SR Stays PG listings.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="username"
            required
            icon={<Mail className="h-4 w-4" aria-hidden="true" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            icon={<Lock className="h-4 w-4" aria-hidden="true" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <p role="alert" className="rounded-xl border border-error/20 bg-error/8 px-3.5 py-2.5 text-sm text-error">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" loading={submitting}>
            Sign in
          </Button>
        </form>
      </Card>
    </section>
  );
}
