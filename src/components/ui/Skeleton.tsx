import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-md bg-[length:400%_100%] bg-[linear-gradient(90deg,rgba(0,0,0,0.06)_25%,rgba(0,0,0,0.12)_37%,rgba(0,0,0,0.06)_63%)]",
        className,
      )}
    />
  );
}
