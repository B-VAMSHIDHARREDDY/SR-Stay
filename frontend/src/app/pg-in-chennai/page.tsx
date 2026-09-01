import type { Metadata } from "next";
import { buildCityMetadata, CityPageContent } from "@/components/city-page-content";

export const metadata: Metadata = buildCityMetadata("chennai");

export default function Page() {
  return <CityPageContent slug="chennai" />;
}
