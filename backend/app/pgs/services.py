import enum
import uuid
from typing import Any

from sqlalchemy import ARRAY, ColumnElement, String, cast, func, select
from sqlalchemy.dialects.postgresql import array as pg_array
from sqlalchemy.orm import Session

from app.owners.models import OwnerPhoneNumber
from app.pgs.models import Gender, PGListing


def _attach_owner_phones(db: Session, listings: list[PGListing]) -> None:
    """Populates `owner_public_phone`/`owner_whatsapp_phone` on each listing
    from its linked owner's phone numbers. Private numbers are never
    fetched here — they must stay out of every PGOut-shaped response."""
    for listing in listings:
        listing.owner_public_phone = None
        listing.owner_whatsapp_phone = None

    owner_ids = {listing.owner_id for listing in listings if listing.owner_id is not None}
    if not owner_ids:
        return

    rows = db.execute(
        select(OwnerPhoneNumber.owner_id, OwnerPhoneNumber.type, OwnerPhoneNumber.number).where(
            OwnerPhoneNumber.owner_id.in_(owner_ids), OwnerPhoneNumber.type.in_(("public", "whatsapp"))
        )
    ).all()
    phones: dict[uuid.UUID, dict[str, str]] = {}
    for owner_id, phone_type, number in rows:
        phones.setdefault(owner_id, {})[phone_type] = number

    for listing in listings:
        owner_phones = phones.get(listing.owner_id) if listing.owner_id else None
        if owner_phones:
            listing.owner_public_phone = owner_phones.get("public")
            listing.owner_whatsapp_phone = owner_phones.get("whatsapp")


class SortOption(str, enum.Enum):
    newest = "newest"
    price_asc = "price_asc"
    price_desc = "price_desc"


_SORT_CLAUSES: dict[SortOption, ColumnElement] = {
    SortOption.newest: PGListing.created_at.desc(),
    SortOption.price_asc: PGListing.price_monthly.asc(),
    SortOption.price_desc: PGListing.price_monthly.desc(),
}


def search_pgs(
    db: Session,
    *,
    city: str | None,
    locality: str | None,
    q: str | None,
    gender: Gender | None,
    min_price: int | None,
    max_price: int | None,
    sharing_type: str | None,
    amenities: list[str] | None,
    sort: SortOption,
    page: int,
    page_size: int,
) -> tuple[list[PGListing], int]:
    filters = [PGListing.is_active.is_(True)]

    if city:
        filters.append(func.lower(PGListing.city) == city.lower())
    if locality:
        filters.append(func.lower(PGListing.locality) == locality.lower())
    if gender:
        filters.append(PGListing.gender == gender)
    if min_price is not None:
        filters.append(PGListing.price_monthly >= min_price)
    if max_price is not None:
        filters.append(PGListing.price_monthly <= max_price)
    if sharing_type:
        filters.append(PGListing.sharing_types.has_key(sharing_type))
    if amenities:
        # has_all()'s default bind type is JSONB, but the `?&` operator requires a
        # text[] on the right-hand side — cast explicitly to match.
        filters.append(PGListing.amenities.has_all(cast(pg_array(amenities), ARRAY(String))))
    if q:
        pattern = f"%{q.lower()}%"
        filters.append(
            func.lower(PGListing.name).like(pattern)
            | func.lower(PGListing.locality).like(pattern)
            | func.lower(PGListing.address).like(pattern)
        )

    base_stmt = select(PGListing).where(*filters)

    total = db.scalar(select(func.count()).select_from(base_stmt.subquery())) or 0

    items = list(
        db.execute(
            base_stmt.order_by(_SORT_CLAUSES[sort]).offset((page - 1) * page_size).limit(page_size)
        )
        .scalars()
        .all()
    )
    _attach_owner_phones(db, items)

    return items, total


def get_active_pg(db: Session, pg_id: uuid.UUID) -> PGListing | None:
    pg = db.get(PGListing, pg_id)
    if pg is None or not pg.is_active:
        return None
    _attach_owner_phones(db, [pg])
    return pg


def list_pgs(db: Session, *, city: str | None) -> list[PGListing]:
    stmt = select(PGListing).order_by(PGListing.created_at.desc())
    if city:
        stmt = stmt.where(PGListing.city == city)
    items = list(db.execute(stmt).scalars().all())
    _attach_owner_phones(db, items)
    return items


def get_pg(db: Session, pg_id: uuid.UUID) -> PGListing | None:
    pg = db.get(PGListing, pg_id)
    if pg is not None:
        _attach_owner_phones(db, [pg])
    return pg


def create_pg(db: Session, data: dict[str, Any]) -> PGListing:
    pg = PGListing(**data)
    db.add(pg)
    db.commit()
    db.refresh(pg)
    _attach_owner_phones(db, [pg])
    return pg


def update_pg(db: Session, pg: PGListing, data: dict[str, Any]) -> PGListing:
    for field, value in data.items():
        setattr(pg, field, value)
    db.commit()
    db.refresh(pg)
    _attach_owner_phones(db, [pg])
    return pg


def delete_pg(db: Session, pg: PGListing) -> None:
    db.delete(pg)
    db.commit()
