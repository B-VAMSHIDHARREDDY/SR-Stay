import { Apple, PlayCircle, QrCode } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { Button } from "@/components/ui/Button";

export function DownloadApp() {
  return (
    <section id="download" className="bg-mesh-dark bg-grain relative overflow-hidden py-16 text-white lg:py-24">
      <div className="container-page relative z-10 flex flex-col items-center gap-10 text-center lg:flex-row lg:text-left">
        <div className="flex-1">
          <span className="text-label inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 font-semibold uppercase tracking-wide text-white/90">
            Now on iOS & Android
          </span>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-h2">
            Download SR Stays — <span className="text-gradient-ember">Search PGs on the Go</span>
          </h2>
          <p className="mt-4 text-white/60">
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

        <div className="relative shrink-0">
          <div className="absolute -inset-4 -z-10 rounded-4xl bg-gradient-ember opacity-30 blur-2xl" aria-hidden="true" />
          <div className="flex h-40 w-40 items-center justify-center rounded-3xl bg-paper p-3 shadow-xl">
            <QrCode className="h-full w-full text-brand-black" strokeWidth={1.25} aria-hidden="true" />
            <span className="sr-only">QR code to download the SR Stays app</span>
          </div>
        </div>
      </div>
    </section>
  );
}
