import type { Metadata } from "next";
import { buildCityMetadata, CityPageContent } from "@/components/city-page-content";

export const metadata: Metadata = buildCityMetadata("pune");

export default function Page() {
  return <CityPageContent slug="pune" />;
}
