import { Accordion } from "@/components/ui/Accordion";
import type { Faq } from "@/lib/faqs";

export function FaqList({ faqs, className }: { faqs: Faq[]; className?: string }) {
  const items = faqs.map((f) => ({ id: f.question, question: f.question, answer: f.answer }));
  return <Accordion items={items} defaultOpenId={items[0]?.id} className={className} />;
}
