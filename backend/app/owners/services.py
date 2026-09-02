import uuid
from typing import Any

from sqlalchemy import delete, func, select
from sqlalchemy.orm import Session

from app.owners.models import Owner, OwnerPhoneNumber
from app.pgs.models import PGListing


def _attach_phone_numbers(db: Session, owners: list[Owner]) -> None:
    if not owners:
        return
    owner_ids = [o.id for o in owners]
    rows = db.execute(
        select(OwnerPhoneNumber).where(OwnerPhoneNumber.owner_id.in_(owner_ids)).order_by(OwnerPhoneNumber.type)
    ).scalars().all()
    by_owner: dict[uuid.UUID, list[OwnerPhoneNumber]] = {}
    for row in rows:
        by_owner.setdefault(row.owner_id, []).append(row)
    for owner in owners:
        owner.phone_numbers = by_owner.get(owner.id, [])


def list_owners(db: Session) -> list[Owner]:
    owners = list(db.execute(select(Owner).order_by(Owner.name)).scalars().all())
    counts = dict(
        db.execute(
            select(PGListing.owner_id, func.count())
            .where(PGListing.owner_id.is_not(None))
            .group_by(PGListing.owner_id)
        ).all()
    )
    for owner in owners:
        owner.pg_count = counts.get(owner.id, 0)
    _attach_phone_numbers(db, owners)
    return owners


def get_owner(db: Session, owner_id: uuid.UUID) -> Owner | None:
    owner = db.get(Owner, owner_id)
    if owner is not None:
        owner.pg_count = db.scalar(
            select(func.count()).select_from(PGListing).where(PGListing.owner_id == owner_id)
        )
        _attach_phone_numbers(db, [owner])
    return owner


def _replace_phone_numbers(db: Session, owner: Owner, phone_numbers: list[dict[str, Any]]) -> None:
    db.execute(delete(OwnerPhoneNumber).where(OwnerPhoneNumber.owner_id == owner.id))
    for entry in phone_numbers:
        db.add(OwnerPhoneNumber(owner_id=owner.id, type=entry["type"], number=entry["number"]))


def create_owner(db: Session, data: dict[str, Any]) -> Owner:
    phone_numbers = data.pop("phone_numbers", [])
    owner = Owner(**data)
    db.add(owner)
    db.flush()
    _replace_phone_numbers(db, owner, phone_numbers)
    db.commit()
    db.refresh(owner)
    owner.pg_count = 0
    _attach_phone_numbers(db, [owner])
    return owner


def update_owner(db: Session, owner: Owner, data: dict[str, Any]) -> Owner:
    phone_numbers = data.pop("phone_numbers", None)
    for field, value in data.items():
        setattr(owner, field, value)
    if phone_numbers is not None:
        _replace_phone_numbers(db, owner, phone_numbers)
    db.commit()
    db.refresh(owner)
    owner.pg_count = db.scalar(
        select(func.count()).select_from(PGListing).where(PGListing.owner_id == owner.id)
    )
    _attach_phone_numbers(db, [owner])
    return owner


def delete_owner(db: Session, owner: Owner) -> None:
    db.delete(owner)
    db.commit()
