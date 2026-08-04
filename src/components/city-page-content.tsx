import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { cities, getCityBySlug } from "@/lib/cities";
import { faqs } from "@/lib/faqs";
import { siteConfig } from "@/lib/site-config";

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

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <nav className="text-xs text-brand-black/50" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand-red">Home</Link>
            <span className="mx-1.5">/</span>
            <span className="text-brand-black/70">PG in {city.name}</span>
          </nav>

          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-brand-black sm:text-5xl">
            {city.heading}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-brand-black/70">{city.intro}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-lg bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red">
              {city.pgCount} Verified PGs
            </span>
            <span className="rounded-lg bg-black/5 px-4 py-2 text-sm font-semibold text-brand-black">
              {city.region}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#download"
              className="rounded-lg bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-red-dark"
            >
              Search PGs in {city.name} →
            </Link>
            <Link
              href="/#list-your-pg"
              className="rounded-lg border-2 border-brand-black px-6 py-3 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-black hover:text-white"
            >
              List Your PG in {city.name}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-black/2 py-14">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-black">
            Popular Localities in {city.name}
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {city.localities.map((locality) => (
              <div
                key={locality}
                className="rounded-xl border border-black/10 bg-white px-5 py-4"
              >
                <p className="font-semibold text-brand-black">
                  PG in {locality}, {city.name}
                </p>
                <p className="mt-1 text-sm text-brand-black/55">
                  Verified rooms with real photos & transparent pricing.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-black">
            Frequently Asked Questions — PG in {city.name}
          </h2>
          <div className="mx-auto mt-6 max-w-2xl space-y-3">
            {cityFaqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-black/10 bg-white p-5 open:border-brand-red/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-brand-black">
                  {faq.question}
                  <span
                    className="shrink-0 text-brand-red transition-transform group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-brand-black/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-black/2 py-14">
        <div className="container-page">
          <h2 className="text-2xl font-extrabold tracking-tight text-brand-black">
            Explore Other Cities
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {cities
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/pg-in-${c.slug}`}
                  className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-brand-black transition-colors hover:border-brand-red hover:text-brand-red"
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
