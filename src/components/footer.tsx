import Link from "next/link";
import { Logo } from "./logo";
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
    <footer id="contact" className="bg-brand-black text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo variant="light" />
          <p className="mt-3 text-sm text-white/60">{siteConfig.tagline}</p>
          <p className="mt-4 max-w-sm text-sm text-white/60">{siteConfig.description}</p>
          <div className="mt-5 flex gap-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/70 transition-colors hover:text-brand-red"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Company</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li><Link href="/#about" className="hover:text-brand-red">About Us</Link></li>
            <li><Link href="/#" className="hover:text-brand-red">Careers</Link></li>
            <li><Link href="/#" className="hover:text-brand-red">Blog</Link></li>
            <li><a href={`mailto:${siteConfig.contactEmail}`} className="hover:text-brand-red">Contact</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">For Users</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li><Link href="/#find-a-pg" className="hover:text-brand-red">Find a PG</Link></li>
            <li><Link href="/#download" className="hover:text-brand-red">Download App</Link></li>
            <li><Link href="/#faq" className="hover:text-brand-red">FAQs</Link></li>
          </ul>
          <h3 className="mt-6 text-sm font-semibold text-white">For Owners</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li><Link href="/#list-your-pg" className="hover:text-brand-red">List Your PG</Link></li>
            <li><Link href="/#list-your-pg" className="hover:text-brand-red">Owner Dashboard</Link></li>
            <li><Link href="/#list-your-pg" className="hover:text-brand-red">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Cities We Cover</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link href={`/pg-in-${city.slug}`} className="hover:text-brand-red">
                  PG in {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 md:flex-row">
          <p>© {year} SR Stays. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/#" className="hover:text-brand-red">Privacy Policy</Link>
            <Link href="/#" className="hover:text-brand-red">Terms of Service</Link>
            <Link href="/#" className="hover:text-brand-red">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
