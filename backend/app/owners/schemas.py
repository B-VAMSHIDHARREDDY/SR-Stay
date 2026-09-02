import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class OwnerBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=6, max_length=20)
    email: str | None = None
    notes: str = ""


class OwnerCreate(OwnerBase):
    pass


class OwnerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    phone: str | None = Field(default=None, min_length=6, max_length=20)
    email: str | None = None
    notes: str | None = None


class OwnerOut(OwnerBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pg_count: int = 0
    created_at: datetime
    updated_at: datetime
