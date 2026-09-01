"""Seed pg_listings with sample data for Hyderabad, Bangalore, and Pune.

Idempotent: re-running skips (city, locality, name) combinations that already
exist, so it's safe to run more than once.

Usage (from backend/, with the venv active):
    python -m scripts.seed_pgs
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.database import SessionLocal
from app.pgs.models import Gender, PGListing

# Keep these in sync with the `localities` arrays in frontend/src/lib/cities.ts —
# the public site filters listings by an exact (case-insensitive) locality match.
CITY_AREAS: dict[str, list[str]] = {
    "hyderabad": [
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
    "bangalore": [
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
    "pune": [
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
}

CITY_DISPLAY_NAME = {"hyderabad": "Hyderabad", "bangalore": "Bangalore", "pune": "Pune"}
CITY_BASE_PRICE = {"hyderabad": 7000, "bangalore": 9000, "pune": 8000}

BRAND_NAMES = [
    "Comfort Stay",
    "Zen Residency",
    "Urban Nest",
    "Cozy Homes",
    "Elite PG",
    "Silver Oak Residency",
    "Green Valley Stay",
    "Sunrise PG",
    "Royal Residency",
    "Maple Homes",
]

AMENITIES_POOL = [
    "WiFi",
    "Food",
    "Laundry",
    "AC",
    "Power Backup",
    "Housekeeping",
    "CCTV",
    "Parking",
    "Geyser",
    "Fridge",
    "Washing Machine",
    "Gym",
]

SHARING_POOL = ["Single", "Double", "Triple", "Four Sharing"]

GENDERS = [Gender.unisex, Gender.male, Gender.female]

# Obviously-fake, easy to bulk-identify/clean-up placeholder contact number.
PLACEHOLDER_PHONE = "9999999999"

PGS_PER_AREA = 10


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def pick(pool: list[str], start: int, count: int) -> list[str]:
    return [pool[(start + i) % len(pool)] for i in range(count)]


def build_listings() -> list[dict]:
    listings = []
    for city_slug, areas in CITY_AREAS.items():
        city_name = CITY_DISPLAY_NAME[city_slug]
        base_price = CITY_BASE_PRICE[city_slug]

        for area_index, area in enumerate(areas):
            for i in range(PGS_PER_AREA):
                brand = BRAND_NAMES[i % len(BRAND_NAMES)]
                name = f"{brand} - {area}"
                amenities = pick(AMENITIES_POOL, i, 4)
                sharing_types = pick(SHARING_POOL, i, 2)
                price_monthly = base_price + area_index * 150 + i * 400
                seed = slugify(f"{city_slug}-{area}-{i}")

                listings.append(
                    {
                        "name": name,
                        "city": city_slug,
                        "locality": area,
                        "address": f"{brand}, near {area} main road, {city_name}",
                        "gender": GENDERS[i % len(GENDERS)],
                        "price_monthly": price_monthly,
                        "security_deposit": price_monthly,
                        "sharing_types": sharing_types,
                        "amenities": amenities,
                        "images": [f"https://picsum.photos/seed/{seed}-{k}/640/480" for k in range(3)],
                        "contact_phone": PLACEHOLDER_PHONE,
                        "description": (
                            f"{brand} in {area}, {city_name} offers a comfortable PG stay with "
                            f"{', '.join(amenities[:3])} and more. Zero brokerage, verified listing."
                        ),
                        "is_active": True,
                    }
                )
    return listings


def main() -> None:
    listings = build_listings()

    db = SessionLocal()
    try:
        existing = {
            (row.city, row.locality, row.name)
            for row in db.execute(
                select(PGListing.city, PGListing.locality, PGListing.name).where(
                    PGListing.city.in_(CITY_AREAS.keys())
                )
            )
        }

        to_insert = [
            PGListing(**data)
            for data in listings
            if (data["city"], data["locality"], data["name"]) not in existing
        ]

        db.add_all(to_insert)
        db.commit()

        print(f"Inserted {len(to_insert)} PG listings (skipped {len(listings) - len(to_insert)} already present).")
    finally:
        db.close()


if __name__ == "__main__":
    main()
