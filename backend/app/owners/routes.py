import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.models import AdminUser
from app.auth.services import get_current_admin
from app.database import get_db
from app.owners import services
from app.owners.models import Owner
from app.owners.schemas import OwnerCreate, OwnerOut, OwnerUpdate

admin_router = APIRouter(prefix="/api/admin/owners", tags=["admin"])


@admin_router.get("", response_model=list[OwnerOut])
def list_owners(
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> list[Owner]:
    return services.list_owners(db)


@admin_router.post("", response_model=OwnerOut, status_code=201)
def create_owner(
    payload: OwnerCreate,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> Owner:
    try:
        return services.create_owner(db, payload.model_dump())
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="An owner with this phone number already exists")


@admin_router.put("/{owner_id}", response_model=OwnerOut)
def update_owner(
    owner_id: uuid.UUID,
    payload: OwnerUpdate,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> Owner:
    owner = services.get_owner(db, owner_id)
    if owner is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    try:
        return services.update_owner(db, owner, payload.model_dump(exclude_unset=True))
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="An owner with this phone number already exists")


@admin_router.delete("/{owner_id}", status_code=204)
def delete_owner(
    owner_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> None:
    owner = services.get_owner(db, owner_id)
    if owner is None:
        raise HTTPException(status_code=404, detail="Owner not found")
    services.delete_owner(db, owner)
