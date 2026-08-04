import type { LucideIcon } from "lucide-react";

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 transition-shadow hover:shadow-lg">
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <h3 className="mt-4 text-base font-bold text-brand-black">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-black/65">{description}</p>
    </div>
  );
}
