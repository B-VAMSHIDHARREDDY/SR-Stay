import { Apple, PlayCircle, QrCode } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

export function DownloadApp() {
  return (
    <section id="download" className="relative overflow-hidden bg-brand-black py-16 text-white lg:py-24">
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-brand-red/10"
        aria-hidden="true"
      />
      <div className="container-page relative flex flex-col items-center gap-10 text-center lg:flex-row lg:text-left">
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-h2">
            Download SR Stays — Search PGs on the Go
          </h2>
          <p className="mt-4 text-white/65">
            Get the app for real-time listings, direct owner contact, and PG maintenance
            requests — right from your phone.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button href={siteConfig.links.appStore} variant="outline-inverse" icon={<Apple className="h-5 w-5" />}>
              App Store
            </Button>
            <Button href={siteConfig.links.googlePlay} icon={<PlayCircle className="h-5 w-5" />}>
              Google Play
            </Button>
          </div>
        </div>

        <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-2xl bg-white p-3">
          <QrCode className="h-full w-full text-brand-black" strokeWidth={1.25} aria-hidden="true" />
          <span className="sr-only">QR code to download the SR Stays app</span>
        </div>
      </div>
    </section>
  );
}
