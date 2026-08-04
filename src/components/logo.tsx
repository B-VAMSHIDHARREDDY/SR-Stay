import Link from "next/link";
import Image from "next/image";

export function Logo({
  className = "",
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      aria-label="SR Stays home"
      className={`flex items-center gap-2 font-extrabold tracking-tight ${className}`}
    >
      <Image
        src="/logo-icon.png"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 shrink-0 rounded-lg"
        priority
      />
      <span className="text-xl leading-none">
        <span className="text-brand-red">SR</span>
        <span className={variant === "light" ? "text-white" : "text-brand-black"}>STAYS</span>
      </span>
    </Link>
  );
}
