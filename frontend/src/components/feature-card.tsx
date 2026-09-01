import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function FeatureCard({
  icon: Icon,
  title,
  description,
  tone = "light",
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "light" | "gradient" | "ink";
  className?: string;
}) {
  const inverted = tone !== "light";
  return (
    <Card hover tone={tone} className={cn("group h-full", className)}>
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:scale-105",
          inverted ? "bg-white/15 text-white" : "bg-gradient-ember-soft text-brand-red",
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={2.25} />
      </div>
      <h3 className={cn("font-display text-h4 mt-4 font-bold", inverted ? "text-white" : "text-brand-black")}>
        {title}
      </h3>
      <p className={cn("mt-2 text-sm leading-relaxed", inverted ? "text-white/70" : "text-brand-black/65")}>
        {description}
      </p>
    </Card>
  );
}
