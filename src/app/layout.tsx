import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { JsonLd } from "@/components/json-ld";
import { siteConfig } from "@/lib/site-config";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SR Stays – Find Verified PG Accommodation Near You | Stay Comfort, Feel Home",
    template: "%s | SR Stays",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "SR Stays – Stay Comfort, Feel Home",
    description:
      "Search verified PGs, manage your property, and handle maintenance — all in one app.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "SR Stays – Find Verified PGs Near You",
    description: "Search, book, and manage PG stays — all in one place.",
  },
};

const mobileApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "SR Stays",
  operatingSystem: "ANDROID, iOS",
  applicationCategory: "LifestyleApplication",
  description:
    "SR Stays is a PG (Paying Guest) discovery and management platform connecting PG seekers with verified PG owners, along with a dedicated PG maintenance module.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.6",
    ratingCount: "2500",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <JsonLd data={mobileApplicationJsonLd} />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
