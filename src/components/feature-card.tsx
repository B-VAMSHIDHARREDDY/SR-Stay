import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

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
    <Card hover>
      <div
        className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red"
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <h3 className="text-h4 mt-4 font-bold text-brand-black">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-black/65">{description}</p>
    </Card>
  );
}
