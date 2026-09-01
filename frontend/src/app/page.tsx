import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { Hero } from "@/components/sections/hero";
import { ProblemSolution } from "@/components/sections/problem-solution";
import { SeekerFeatures } from "@/components/sections/seeker-features";
import { OwnerFeatures } from "@/components/sections/owner-features";
import { Maintenance } from "@/components/sections/maintenance";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Cities } from "@/components/sections/cities";
import { Testimonials } from "@/components/sections/testimonials";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { FaqSection } from "@/components/sections/faq";
import { faqs } from "@/lib/faqs";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <Hero />
      <ProblemSolution />
      <SeekerFeatures />
      <OwnerFeatures />
      <Maintenance />
      <HowItWorks />
      <Cities />
      <Testimonials />
      <WhyChooseUs />
      <FaqSection />
    </>
  );
}
