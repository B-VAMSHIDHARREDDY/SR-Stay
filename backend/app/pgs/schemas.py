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
    contact_phone: str = Field(min_length=6, max_length=20)
    description: str = ""
    is_active: bool = True


class PGCreate(PGBase):
    pass


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
    contact_phone: str | None = Field(default=None, min_length=6, max_length=20)
    description: str | None = None
    is_active: bool | None = None


class PGOut(PGBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class PGSearchResponse(BaseModel):
    items: list[PGOut]
    total: int
    page: int
    page_size: int
