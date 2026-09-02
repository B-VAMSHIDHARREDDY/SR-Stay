"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Menu, User, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui/Button";
import { DURATION, EASE } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { getToken } from "@/lib/user-auth";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Find a PG" },
  { href: "/#list-your-pg", label: "List Your PG" },
  { href: "/#maintenance", label: "PG Maintenance" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#contact", label: "Contact" },
];

/** Only routes with a real, distinct URL can reliably show as "active" —
 * the rest are same-page anchors on the homepage with no independent route
 * to key off without scroll-spy, which is out of scope here. */
function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/search") return pathname === "/search" || pathname.startsWith("/pg-in-");
  return false;
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoggedIn(!!getToken());
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
        scrolled ? "bg-cream/85 shadow-sm backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="container-page grid h-[4.5rem] grid-cols-[auto_1fr_auto] items-center gap-4 sm:h-20">
        <Logo />

        <nav className="hidden items-center justify-center gap-6 lg:flex xl:gap-8" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  active ? "text-brand-red" : "text-brand-black/75 hover:text-brand-red",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2">
          <div className="hidden lg:block">
            {loggedIn ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-sm font-semibold text-brand-black transition-colors hover:text-brand-red"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                My Account
              </Link>
            ) : (
              <Button href="/login" size="sm">
                Login
              </Button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-black transition-colors hover:bg-black/5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="close"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: DURATION.fast, ease: EASE }}
                  className="flex"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: DURATION.fast, ease: EASE }}
                  className="flex"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE }}
            className="bg-mesh-dark bg-grain fixed inset-0 z-40 flex flex-col pt-20 pb-8 lg:hidden"
          >
            <nav className="container-page relative z-10 flex flex-1 flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link, i) => {
                const active = isActive(pathname, link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: DURATION.base, ease: EASE, delay: 0.05 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "font-display block rounded-2xl px-3 py-3.5 text-2xl font-semibold transition-colors hover:bg-white/5",
                        active ? "text-brand-red" : "text-white/90 hover:text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.base, ease: EASE, delay: 0.05 + navLinks.length * 0.04 }}
                className="relative z-10 mt-auto pt-8"
              >
                {loggedIn ? (
                  <Button href="/account" onClick={() => setOpen(false)} className="w-full">
                    My Account
                  </Button>
                ) : (
                  <Button href="/login" onClick={() => setOpen(false)} className="w-full">
                    Login
                  </Button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
