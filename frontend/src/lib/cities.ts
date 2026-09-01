export interface City {
  slug: string;
  name: string;
  region: string;
  heading: string;
  intro: string;
  localities: string[];
  /** Extra place names that should also resolve to this city during location detection. */
  aliases?: string[];
}

export const cities: City[] = [
  {
    slug: "hyderabad",
    name: "Hyderabad",
    region: "Telangana",
    heading: "Best PG Accommodation in Hyderabad",
    intro:
      "Find verified PGs across Hyderabad's top residential and IT hubs — from Hitech City to Banjara Hills — with transparent pricing and zero brokerage.",
    localities: [
      "Banjara Hills",
      "Hitech City / Madhapur",
      "Gachibowli",
      "Kondapur",
      "Ameerpet",
      "Kukatpally",
      "Begumpet",
      "Somajiguda",
      "Miyapur",
      "Manikonda",
      "Secunderabad",
      "Uppal",
      "LB Nagar",
      "Dilsukhnagar",
      "Jubilee Hills",
    ],
  },
  {
    slug: "bangalore",
    name: "Bangalore",
    region: "Karnataka",
    heading: "Best PG Accommodation in Bangalore",
    intro:
      "Discover verified PGs near Bangalore's tech parks and colleges, with amenities like WiFi, food, and laundry included.",
    localities: [
      "Koramangala",
      "HSR Layout",
      "Whitefield",
      "Electronic City",
      "Marathahalli",
      "BTM Layout",
      "Indiranagar",
      "JP Nagar",
      "Bellandur",
      "Sarjapur Road",
      "Hebbal",
      "Yelahanka",
      "Banashankari",
      "Rajajinagar",
      "KR Puram",
    ],
  },
  {
    slug: "pune",
    name: "Pune",
    region: "Maharashtra",
    heading: "Best PG Accommodation in Pune",
    intro:
      "Browse verified PG rooms across Pune's IT corridors and college areas with real photos and upfront pricing.",
    localities: [
      "Hinjewadi",
      "Kothrud",
      "Viman Nagar",
      "Baner",
      "Wakad",
      "Aundh",
      "Magarpatta",
      "Kharadi",
      "Hadapsar",
      "Katraj",
      "Pimple Saudagar",
      "Wagholi",
      "Shivaji Nagar",
      "Camp",
      "Bavdhan",
    ],
  },
  {
    slug: "chennai",
    name: "Chennai",
    region: "Tamil Nadu",
    heading: "Best PG Accommodation in Chennai",
    intro:
      "Search verified men's, women's, and co-living PGs across Chennai with direct owner contact — zero brokerage.",
    localities: ["OMR", "T Nagar", "Velachery", "Anna Nagar", "Guindy"],
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    region: "Maharashtra",
    heading: "Best PG Accommodation in Mumbai",
    intro:
      "Find verified PG stays across Mumbai's business districts and suburbs, with transparent rent and deposit details.",
    localities: ["Andheri", "Powai", "Bandra", "Malad", "Thane"],
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR",
    region: "Delhi / NCR",
    heading: "Best PG Accommodation in Delhi NCR",
    intro:
      "Explore verified PGs across Delhi, Gurugram, and Noida with real photos, ratings, and instant owner contact.",
    localities: ["Gurugram Cyber City", "Noida Sector 62", "Lajpat Nagar", "Dwarka", "Saket"],
    aliases: ["delhi", "new delhi", "gurugram", "gurgaon", "noida", "faridabad", "ghaziabad", "ncr"],
  },
];

export function getCityBySlug(slug: string): City | undefined {
  return cities.find((city) => city.slug === slug);
}
