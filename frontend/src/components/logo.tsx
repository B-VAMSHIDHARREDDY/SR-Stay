import Link from "next/link";
import { FadeImage } from "@/components/ui/FadeImage";

export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  if (variant === "light") {
    return (
      <Link
        href="/"
        aria-label="SR Stays home"
        className={`flex items-center gap-2 font-display font-extrabold tracking-tight ${className}`}
      >
        <FadeImage
          src="/logo-icon.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 rounded-xl"
          wrapperClassName="shrink-0"
          priority
        />
        <span className="text-xl leading-none">
          <span className="text-brand-red">SR</span>
          <span className="text-white">STAYS</span>
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="SR Stays home" className={`flex items-center ${className}`}>
      <FadeImage
        src="/logo-full.png"
        alt="SR Stays — Stay Comfort, Feel Home"
        width={1942}
        height={810}
        className="h-9 w-auto sm:h-10"
        wrapperClassName="shrink-0"
        priority
      />
    </Link>
  );
}
