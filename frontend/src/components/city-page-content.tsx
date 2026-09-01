import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { cities, getCityBySlug } from "@/lib/cities";
import { faqs } from "@/lib/faqs";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/faq-list";
import { PgListingsSection } from "@/components/pg-listings-section";

export function buildCityMetadata(slug: string): Metadata {
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Best PG in ${city.name} | Verified PG Accommodation Near You`;
  const description = `Find verified PG accommodation in ${city.name} with real photos, transparent pricing & zero brokerage — across ${city.localities.slice(0, 3).join(", ")} and more.`;

  return {
    title,
    description,
    alternates: { canonical: `/pg-in-${city.slug}` },
    openGraph: { title, description, url: `${siteConfig.url}/pg-in-${city.slug}` },
  };
}

export function CityPageContent({ slug }: { slug: string }) {
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `SR Stays – PG in ${city.name}`,
    description: city.intro,
    areaServed: {
      "@type": "City",
      name: city.name,
    },
    url: `${siteConfig.url}/pg-in-${city.slug}`,
  };

  const cityFaqs = [
    {
      question: `Which areas does SR Stays cover in ${city.name}?`,
      answer: `SR Stays lists verified PGs across ${city.name}, including ${city.localities.join(", ")}.`,
    },
    ...faqs.slice(0, 3),
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cityFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={faqJsonLd} />

      <section className="bg-grain relative overflow-hidden py-16 lg:py-20">
        <div aria-hidden="true" className="bg-mesh-light-bleed" />
        <div className="container-page relative z-10">
          <nav className="text-xs text-brand-black/50" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-red">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-brand-black/70">PG in {city.name}</span>
          </nav>

          <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-brand-black sm:text-h1">
            {city.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-black/65">{city.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Badge variant="neutral">{city.region}</Badge>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#pg-listings">Search PGs in {city.name} →</Button>
            <Button href="/#list-your-pg" variant="outline">
              List Your PG in {city.name}
            </Button>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <PgListingsSection citySlug={city.slug} cityName={city.name} />
      </Suspense>

      <section className="bg-cream-deep py-14">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="FAQ">
            Frequently Asked Questions — PG in {city.name}
          </SectionHeading>
          <FaqList faqs={cityFaqs} className="mx-auto mt-6 max-w-2xl" />
        </div>
      </section>

      <section className="bg-paper py-14">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="More cities">Explore Other Cities</SectionHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cities
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/pg-in-${c.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-paper px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-red/30 hover:shadow-md"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-ember-soft text-brand-red">
                    <MapPin className="h-5 w-5" strokeWidth={2.25} aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-brand-black group-hover:text-brand-red">
                      PG in {c.name}
                    </p>
                    <p className="text-xs text-brand-black/50">{c.region}</p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-brand-black/30 transition-all group-hover:translate-x-1 group-hover:text-brand-red"
                    aria-hidden="true"
                  />
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
