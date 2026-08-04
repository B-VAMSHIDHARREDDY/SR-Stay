import { faqs } from "@/lib/faqs";

export function FaqSection() {
  return (
    <section id="faq" className="bg-black/2 py-16 lg:py-24">
      <div className="container-page">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-black sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-black/10 bg-white p-5 open:border-brand-red/40"
              {...(i === 0 ? { open: true } : {})}
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
  );
}
