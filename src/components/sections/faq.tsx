import { faqs } from "@/lib/faqs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/faq-list";

export function FaqSection() {
  return (
    <section id="faq" className="bg-surface-muted py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading>Frequently Asked Questions</SectionHeading>
        <FaqList faqs={faqs} className="mx-auto mt-10 max-w-2xl" />
      </div>
    </section>
  );
}
