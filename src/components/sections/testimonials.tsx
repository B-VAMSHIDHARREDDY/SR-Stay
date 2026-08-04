const testimonials = [
  {
    quote:
      "I found a verified PG near my office in Madhapur within a day — no broker calls, no confusion.",
    author: "Resident, Hyderabad",
  },
  {
    quote:
      "Managing tenants and rent used to be a headache. SR Stays owner dashboard made it effortless.",
    author: "PG Owner, Hyderabad",
  },
  {
    quote: "The maintenance app is a lifesaver — I raise a complaint and it's fixed within hours.",
    author: "Resident, Bangalore",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-black/2 py-16 lg:py-24">
      <div className="container-page">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-black sm:text-4xl">
          What Our Users Say
        </h2>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="rounded-2xl border border-black/10 bg-white p-6"
            >
              <blockquote className="text-sm leading-relaxed text-brand-black/75">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-brand-red">
                — {t.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
