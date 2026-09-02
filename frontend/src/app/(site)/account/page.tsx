"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2, LogOut, Mail, Pencil, Phone, User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/cn";
import { fetchMe, logout, updateMe } from "@/lib/user-auth";
import { ApiError } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "unisex", label: "Unisex" },
];

function initialsFor(profile: UserProfile): string {
  if (profile.name) {
    return profile.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  return profile.phone.slice(-2);
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex items-center justify-between gap-4 border-b py-3.5 first:pt-0 last:border-0 last:pb-0">
      <span className="text-label font-medium text-brand-black/50">{label}</span>
      <span className="text-sm font-semibold text-brand-black">{value}</span>
    </div>
  );
}

function AccountRow({
  icon,
  label,
  tone = "default",
  onClick,
}: {
  icon: ReactNode;
  label: string;
  tone?: "default" | "danger";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-mx-2 flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition-colors hover:bg-black/[0.03]"
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          tone === "danger" ? "bg-error/10 text-error" : "bg-brand-red/8 text-brand-red",
        )}
      >
        {icon}
      </span>
      <span className={cn("flex-1 text-sm font-semibold", tone === "danger" ? "text-error" : "text-brand-black")}>
        {label}
      </span>
      <ChevronRight className="h-4 w-4 shrink-0 text-brand-black/25" aria-hidden="true" />
    </button>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [checking, setChecking] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchMe().then((user) => {
      if (cancelled) return;
      if (!user) {
        router.replace("/login");
        return;
      }
      setProfile(user);
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setGender(user.gender ?? "");
      setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  function startEditing() {
    if (!profile) return;
    setName(profile.name ?? "");
    setEmail(profile.email ?? "");
    setGender(profile.gender ?? "");
    setEditing(true);
  }

  function cancelEditing() {
    if (!profile) return;
    setName(profile.name ?? "");
    setEmail(profile.email ?? "");
    setGender(profile.gender ?? "");
    setEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await updateMe({
        name: name.trim() || null,
        email: email.trim() || null,
        gender: (gender || null) as UserProfile["gender"],
      });
      setProfile(updated);
      setEditing(false);
      toast({ title: "Profile updated", variant: "success" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof ApiError ? err.message : undefined,
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (checking || !profile) {
    return (
      <div className="bg-grain relative flex min-h-screen items-center justify-center">
        <div aria-hidden="true" className="bg-mesh-light-bleed" />
        <Loader2 className="relative z-10 h-6 w-6 animate-spin text-brand-red" aria-hidden="true" />
      </div>
    );
  }

  return (
    <section className="bg-grain relative min-h-screen py-10 sm:py-14">
      <div aria-hidden="true" className="bg-mesh-light-bleed" />
      <div className="container-page relative z-10 max-w-xl space-y-5">
        <h1 className="font-display px-1 text-2xl font-semibold tracking-tight text-brand-black sm:text-h3">
          My Account
        </h1>

        {/* Profile header */}
        <Card padding="lg" className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-ember-soft text-lg font-bold text-brand-red sm:h-20 sm:w-20 sm:text-xl">
            {initialsFor(profile)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display truncate text-lg font-semibold tracking-tight text-brand-black sm:text-xl">
              {profile.name || "Your profile"}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-black/55">
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{profile.phone}</span>
            </p>
            {profile.email && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-brand-black/45">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{profile.email}</span>
              </p>
            )}
          </div>
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              aria-label="Edit profile"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-black/10 text-brand-black/70 transition-colors hover:border-brand-black hover:bg-brand-black hover:text-white"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </Card>

        {/* Personal information */}
        <Card padding="lg">
          <h2 className="text-label mb-1 font-semibold uppercase tracking-wide text-brand-black/40">
            Personal Information
          </h2>
          {editing ? (
            <div className="mt-4 space-y-4">
              <Input
                label="Name"
                icon={<UserIcon className="h-4 w-4" aria-hidden="true" />}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email"
                type="email"
                icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select
                label="Gender"
                placeholder="Select gender"
                options={genderOptions}
                value={gender}
                onChange={setGender}
              />
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={cancelEditing} disabled={saving} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} loading={saving} className="flex-1">
                  Save changes
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <InfoRow label="Name" value={profile.name || "Not set"} />
              <InfoRow label="Email" value={profile.email || "Not set"} />
              <InfoRow label="Gender" value={profile.gender ? profile.gender[0].toUpperCase() + profile.gender.slice(1) : "Not set"} />
            </div>
          )}
        </Card>

        {/* Account actions */}
        {!editing && (
          <Card padding="lg">
            <h2 className="text-label mb-1 font-semibold uppercase tracking-wide text-brand-black/40">Account</h2>
            <div className="mt-2 space-y-1">
              <AccountRow icon={<Pencil className="h-4 w-4" aria-hidden="true" />} label="Edit profile" onClick={startEditing} />
              <AccountRow
                icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
                label="Log out"
                tone="danger"
                onClick={handleLogout}
              />
            </div>
          </Card>
        )}
      </div>
    </section>
  );
}
