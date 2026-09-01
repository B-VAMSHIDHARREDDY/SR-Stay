import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: ReactNode;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-ember-soft text-brand-red/70">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="font-display mt-4 text-base font-bold text-brand-black">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-brand-black/55">{description}</p>}
      {action &&
        (action.href ? (
          <Button href={action.href} size="sm" className="mt-5">
            {action.label}
          </Button>
        ) : (
          <Button onClick={action.onClick} size="sm" className="mt-5">
            {action.label}
          </Button>
        ))}
    </div>
  );
}
