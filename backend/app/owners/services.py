import uuid
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.owners.models import Owner
from app.pgs.models import PGListing


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
    return owners


def get_owner(db: Session, owner_id: uuid.UUID) -> Owner | None:
    owner = db.get(Owner, owner_id)
    if owner is not None:
        owner.pg_count = db.scalar(
            select(func.count()).select_from(PGListing).where(PGListing.owner_id == owner_id)
        )
    return owner


def create_owner(db: Session, data: dict[str, Any]) -> Owner:
    owner = Owner(**data)
    db.add(owner)
    db.commit()
    db.refresh(owner)
    owner.pg_count = 0
    return owner


def update_owner(db: Session, owner: Owner, data: dict[str, Any]) -> Owner:
    for field, value in data.items():
        setattr(owner, field, value)
    db.commit()
    db.refresh(owner)
    owner.pg_count = db.scalar(
        select(func.count()).select_from(PGListing).where(PGListing.owner_id == owner.id)
    )
    return owner


def delete_owner(db: Session, owner: Owner) -> None:
    db.delete(owner)
    db.commit()
