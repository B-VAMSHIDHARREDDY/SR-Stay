import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.pgs.models import Gender


class PGBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=100)
    locality: str = Field(min_length=1, max_length=150)
    address: str
    gender: Gender
    price_monthly: int = Field(gt=0)
    security_deposit: int | None = Field(default=None, ge=0)
    sharing_types: list[str] = Field(default_factory=list)
    amenities: list[str] = Field(default_factory=list)
    images: list[str] = Field(default_factory=list)
    description: str = ""
    is_active: bool = True


class PGCreate(PGBase):
    # Every new PG must have a primary owner — contact info is sourced from
    # the owner's phone numbers, so a listing can't exist without one.
    owner_id: uuid.UUID


class PGUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    city: str | None = Field(default=None, min_length=1, max_length=100)
    locality: str | None = Field(default=None, min_length=1, max_length=150)
    address: str | None = None
    gender: Gender | None = None
    price_monthly: int | None = Field(default=None, gt=0)
    security_deposit: int | None = Field(default=None, ge=0)
    sharing_types: list[str] | None = None
    amenities: list[str] | None = None
    images: list[str] | None = None
    description: str | None = None
    owner_id: uuid.UUID | None = None
    is_active: bool | None = None


class PGOut(PGBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID | None
    # Computed at query time from the linked Owner's OwnerPhoneNumber rows
    # (see app/pgs/services.py) — never sourced from a column on this table,
    # and the `private` type is intentionally never surfaced here.
    owner_public_phone: str | None = None
    owner_whatsapp_phone: str | None = None
    created_at: datetime
    updated_at: datetime


class PGSearchResponse(BaseModel):
    items: list[PGOut]
    total: int
    page: int
    page_size: int
