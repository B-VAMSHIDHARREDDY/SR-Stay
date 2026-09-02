import type { Metadata } from "next";
import { SearchLocationPicker } from "@/components/search-location-picker";

export const metadata: Metadata = {
  title: "Search PG by Location | SR Stays",
  description: "Find your PG — start from your current location, then pick your area, city, or state.",
  robots: { index: false },
};

export default function SearchPage() {
  return <SearchLocationPicker />;
}
