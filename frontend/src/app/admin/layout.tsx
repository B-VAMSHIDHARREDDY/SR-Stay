"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Briefcase, LayoutDashboard, ListChecks, Loader2, LogOut, Menu, Users as UsersIcon, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/cn";
import { DURATION, EASE, fadeIn } from "@/lib/motion";
import { fetchMe, logout } from "@/lib/admin-auth";
import type { AdminUser } from "@/lib/types";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/listings", label: "Listings", icon: ListChecks, exact: false },
  { href: "/admin/owners", label: "Owners", icon: Briefcase, exact: false },
  { href: "/admin/users", label: "Users", icon: UsersIcon, exact: false },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-1" aria-label="Admin">
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-brand-red/10 text-brand-red" : "text-brand-black/70 hover:bg-black/5 hover:text-brand-black",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileNavOpen(false);
  }, [pathname]);

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
    <div className="min-h-screen bg-cream-deep md:grid md:grid-cols-[16rem_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden shrink-0 border-r border-black/8 bg-paper md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-black/8 px-5">
          <Logo className="h-8" />
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-3">
          <NavLinks pathname={pathname} />
        </div>
        <div className="border-t border-black/8 p-3">
          <p className="truncate px-3.5 text-xs text-brand-black/45">{admin.email}</p>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-black/70 transition-colors hover:bg-black/5 hover:text-brand-red"
          >
            <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        {/* Mobile top bar */}
        <header className="flex h-16 items-center justify-between gap-3 border-b border-black/8 bg-paper px-4 md:hidden">
          <Logo className="h-8" />
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open admin menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-black transition-colors hover:bg-black/5"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-100 bg-brand-black/50 md:hidden"
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ duration: DURATION.base, ease: EASE }}
                className="flex h-full w-72 max-w-[85vw] flex-col bg-paper shadow-lg"
              >
                <div className="flex h-16 items-center justify-between border-b border-black/8 px-4">
                  <Logo className="h-8" />
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    aria-label="Close admin menu"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-brand-black transition-colors hover:bg-black/5"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 space-y-1 overflow-y-auto p-3">
                  <NavLinks pathname={pathname} onNavigate={() => setMobileNavOpen(false)} />
                </div>
                <div className="border-t border-black/8 p-3">
                  <p className="truncate px-3.5 text-xs text-brand-black/45">{admin.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-brand-black/70 transition-colors hover:bg-black/5 hover:text-brand-red"
                  >
                    <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
