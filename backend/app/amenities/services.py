import uuid

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.amenities.models import Amenity


def list_amenities(db: Session) -> list[Amenity]:
    return list(db.execute(select(Amenity).order_by(Amenity.name)).scalars().all())


def get_amenity(db: Session, amenity_id: uuid.UUID) -> Amenity | None:
    return db.get(Amenity, amenity_id)


def create_amenity(db: Session, name: str) -> Amenity:
    amenity = Amenity(name=name.strip())
    db.add(amenity)
    db.commit()
    db.refresh(amenity)
    return amenity


def delete_amenity(db: Session, amenity: Amenity) -> None:
    db.delete(amenity)
    db.commit()
