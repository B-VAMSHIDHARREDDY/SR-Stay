import type { Metadata } from "next";
import { buildCityMetadata, CityPageContent } from "@/components/city-page-content";

export const metadata: Metadata = buildCityMetadata("bangalore");

export default function Page() {
  return <CityPageContent slug="bangalore" />;
}
