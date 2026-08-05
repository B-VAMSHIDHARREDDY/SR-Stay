import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui/Button";
import { siteConfig } from "@/lib/site-config";
import { cities } from "@/lib/cities";

const socials = [
  { label: "Instagram", href: siteConfig.links.instagram },
  { label: "Facebook", href: siteConfig.links.facebook },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Twitter / X", href: siteConfig.links.twitter },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-mesh-dark bg-grain relative overflow-hidden text-white">
      <div className="container-page relative z-10 py-14 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-8 rounded-4xl border border-white/10 bg-white/5 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to find a place that feels like home?
            </h2>
            <p className="mt-2 max-w-md text-sm text-white/60">
              Search verified PGs in your city — zero brokerage, real photos, real reviews.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href="/#find-a-pg" icon={<ArrowUpRight className="h-4 w-4" />} iconPosition="right">
              Find My PG
            </Button>
            <Button href="/#list-your-pg" variant="outline-inverse">
              List Your PG
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo variant="light" />
            <p className="mt-3 text-sm text-white/60">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-sm text-sm text-white/50">{siteConfig.description}</p>
            <div className="mt-5 flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 transition-colors hover:text-ember"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/55">
              <li><Link href="/#about" className="hover:text-ember">About Us</Link></li>
              <li><Link href="/#" className="hover:text-ember">Careers</Link></li>
              <li><Link href="/#" className="hover:text-ember">Blog</Link></li>
              <li><a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-ember">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">For Users</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/55">
              <li><Link href="/#find-a-pg" className="hover:text-ember">Find a PG</Link></li>
              <li><Link href="/#download" className="hover:text-ember">Download App</Link></li>
              <li><Link href="/#faq" className="hover:text-ember">FAQs</Link></li>
            </ul>
            <h3 className="font-display mt-6 text-sm font-semibold text-white">For Owners</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/55">
              <li><Link href="/#list-your-pg" className="hover:text-ember">List Your PG</Link></li>
              <li><Link href="/#list-your-pg" className="hover:text-ember">Owner Dashboard</Link></li>
              <li><Link href="/#list-your-pg" className="hover:text-ember">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold text-white">Cities We Cover</h3>
            <ul className="mt-4 space-y-2 text-sm text-white/55">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link href={`/pg-in-${city.slug}`} className="hover:text-ember">
                    PG in {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/45 md:flex-row">
          <p>© {year} SR Stays. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/#" className="hover:text-ember">Privacy Policy</Link>
            <Link href="/#" className="hover:text-ember">Terms of Service</Link>
            <Link href="/#" className="hover:text-ember">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
