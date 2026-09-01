import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.auth.models import AdminUser
from app.auth.services import get_current_admin
from app.database import get_db
from app.pgs import services
from app.pgs.models import Gender, PGListing
from app.pgs.schemas import PGCreate, PGOut, PGSearchResponse, PGUpdate
from app.pgs.services import SortOption

public_router = APIRouter(prefix="/api/pgs", tags=["public"])
admin_router = APIRouter(prefix="/api/admin/pgs", tags=["admin"])


@public_router.get("", response_model=PGSearchResponse)
def search_pgs(
    city: str | None = Query(default=None),
    locality: str | None = Query(default=None),
    q: str | None = Query(default=None, description="Free-text match against name/locality/address"),
    gender: Gender | None = Query(default=None),
    min_price: int | None = Query(default=None, ge=0),
    max_price: int | None = Query(default=None, ge=0),
    sharing_type: str | None = Query(default=None),
    amenities: list[str] | None = Query(default=None, description="Repeat to require multiple amenities"),
    sort: SortOption = Query(default=SortOption.newest),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PGSearchResponse:
    items, total = services.search_pgs(
        db,
        city=city,
        locality=locality,
        q=q,
        gender=gender,
        min_price=min_price,
        max_price=max_price,
        sharing_type=sharing_type,
        amenities=amenities,
        sort=sort,
        page=page,
        page_size=page_size,
    )
    return PGSearchResponse(items=items, total=total, page=page, page_size=page_size)


@public_router.get("/{pg_id}", response_model=PGOut)
def get_pg(pg_id: uuid.UUID, db: Session = Depends(get_db)) -> PGListing:
    pg = services.get_active_pg(db, pg_id)
    if pg is None:
        raise HTTPException(status_code=404, detail="PG not found")
    return pg


@admin_router.get("", response_model=list[PGOut])
def list_pgs(
    city: str | None = Query(default=None),
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> list[PGListing]:
    return services.list_pgs(db, city=city)


@admin_router.post("", response_model=PGOut, status_code=201)
def create_pg(
    payload: PGCreate,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> PGListing:
    return services.create_pg(db, payload.model_dump())


@admin_router.put("/{pg_id}", response_model=PGOut)
def update_pg(
    pg_id: uuid.UUID,
    payload: PGUpdate,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> PGListing:
    pg = services.get_pg(db, pg_id)
    if pg is None:
        raise HTTPException(status_code=404, detail="PG not found")
    return services.update_pg(db, pg, payload.model_dump(exclude_unset=True))


@admin_router.delete("/{pg_id}", status_code=204)
def delete_pg(
    pg_id: uuid.UUID,
    db: Session = Depends(get_db),
    _current_admin: AdminUser = Depends(get_current_admin),
) -> None:
    pg = services.get_pg(db, pg_id)
    if pg is None:
        raise HTTPException(status_code=404, detail="PG not found")
    services.delete_pg(db, pg)
