"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, ListChecks, Loader2, LogOut } from "lucide-react";
import Link from "next/link";
import { fetchMe, logout } from "@/lib/admin-auth";
import type { AdminUser } from "@/lib/types";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchMe().then((result) => {
      if (cancelled) return;
      if (!result) {
        router.replace("/admin-login");
        return;
      }
      setAdmin(result);
      setChecking(false);
    });
    return () => {
      cancelled = true;
    };
  }, [router]);

  function handleLogout() {
    logout();
    router.replace("/admin-login");
  }

  if (checking || !admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream-deep">
        <Loader2 className="h-6 w-6 animate-spin text-brand-red" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-deep">
      <header className="border-b border-black/8 bg-paper">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <span className="font-display shrink-0 truncate text-base font-semibold tracking-tight text-brand-black sm:text-lg">
            SR Stays Admin
          </span>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <span className="hidden max-w-40 truncate text-sm text-brand-black/55 sm:inline">{admin.email}</span>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="flex items-center gap-1.5 rounded-full border border-black/8 px-3 py-2 text-sm font-medium text-brand-black/70 transition-colors hover:border-brand-red hover:text-brand-red sm:px-3.5"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
        <nav className="ui-scrollbar container-page flex items-center gap-1 overflow-x-auto border-t border-black/5 py-2" aria-label="Admin">
          <Link
            href="/admin"
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-brand-black/70 transition-colors hover:bg-black/5 hover:text-brand-black"
          >
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            Dashboard
          </Link>
          <Link
            href="/admin/listings"
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-brand-black/70 transition-colors hover:bg-black/5 hover:text-brand-black"
          >
            <ListChecks className="h-4 w-4" aria-hidden="true" />
            Listings
          </Link>
        </nav>
      </header>
      <main className="container-page py-6 sm:py-8">{children}</main>
    </div>
  );
}
