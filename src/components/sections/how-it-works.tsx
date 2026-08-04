const tracks = [
  {
    title: "For PG Seekers",
    steps: ["Search your locality", "Compare verified PGs", "Visit / Book", "Move In"],
  },
  {
    title: "For PG Owners",
    steps: ["List your PG (Free)", "Get verified", "Receive enquiries", "Manage via dashboard"],
  },
  {
    title: "For Maintenance",
    steps: ["Raise a request", "Owner/staff notified", "Track status", "Resolved & logged"],
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-black/2 py-16 lg:py-24">
      <div className="container-page">
        <h2 className="text-center text-3xl font-extrabold tracking-tight text-brand-black sm:text-4xl">
          How It Works
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {tracks.map((track) => (
            <div key={track.title} className="rounded-2xl border border-black/10 bg-white p-6">
              <h3 className="text-lg font-bold text-brand-black">{track.title}</h3>
              <ol className="mt-5 space-y-4">
                {track.steps.map((step, i) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm text-brand-black/75">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
