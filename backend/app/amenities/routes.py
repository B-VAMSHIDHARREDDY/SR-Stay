import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.amenities import services
from app.amenities.schemas import AmenityCreate, AmenityOut
from app.auth.models import AdminUser
from app.auth.services import get_current_admin
from app.database import get_db

public_router = APIRouter(prefix="/api/amenities", tags=["public"])
admin_router = APIRouter(prefix="/api/admin/amenities", tags=["admin"])


@public_router.get("", response_model=list[AmenityOut])
def list_amenities(db: Session = Depends(get_db)) -> list[AmenityOut]:
    return services.list_amenities(db)


@admin_router.post("", response_model=AmenityOut, status_code=201)
def create_amenity(
    payload: AmenityCreate,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> AmenityOut:
    try:
        return services.create_amenity(db, payload.name)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Amenity already exists")


@admin_router.delete("/{amenity_id}", status_code=204)
def delete_amenity(
    amenity_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> None:
    amenity = services.get_amenity(db, amenity_id)
    if amenity is None:
        raise HTTPException(status_code=404, detail="Amenity not found")
    services.delete_amenity(db, amenity)
