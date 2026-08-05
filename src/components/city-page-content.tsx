import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { cities, getCityBySlug } from "@/lib/cities";
import { faqs } from "@/lib/faqs";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/faq-list";
import { CityLocalitiesGrid } from "@/components/city-localities-grid";

export function buildCityMetadata(slug: string): Metadata {
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `Best PG in ${city.name} | Verified PG Accommodation Near You`;
  const description = `Find verified PG accommodation in ${city.name} with real photos, transparent pricing & zero brokerage. ${city.pgCount} PGs across ${city.localities.slice(0, 3).join(", ")} and more.`;

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
      question: `How many verified PGs does SR Stays have in ${city.name}?`,
      answer: `SR Stays lists ${city.pgCount} verified PGs across ${city.name}, including ${city.localities.join(", ")}.`,
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

      <section className="bg-mesh-light bg-grain relative overflow-hidden py-16 lg:py-20">
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
            <Badge variant="brand">{city.pgCount} Verified PGs</Badge>
            <Badge variant="neutral">{city.region}</Badge>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/#download">Search PGs in {city.name} →</Button>
            <Button href="/#list-your-pg" variant="outline">
              List Your PG in {city.name}
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-cream-deep py-14">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="Neighborhoods">
            Popular Localities in {city.name}
          </SectionHeading>
          <CityLocalitiesGrid localities={city.localities} cityName={city.name} />
        </div>
      </section>

      <section className="bg-paper py-14">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="FAQ">
            Frequently Asked Questions — PG in {city.name}
          </SectionHeading>
          <FaqList faqs={cityFaqs} className="mx-auto mt-6 max-w-2xl" />
        </div>
      </section>

      <section className="bg-cream-deep py-14">
        <div className="container-page">
          <SectionHeading align="left" eyebrow="More cities">Explore Other Cities</SectionHeading>
          <div className="mt-6 flex flex-wrap gap-3">
            {cities
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/pg-in-${c.slug}`}
                  className="rounded-full border border-border bg-paper px-4 py-2 text-sm font-medium text-brand-black transition-colors hover:border-brand-red hover:text-brand-red"
                >
                  PG in {c.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
