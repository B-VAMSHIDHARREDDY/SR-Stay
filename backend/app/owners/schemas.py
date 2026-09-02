import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Literal keeps today's 3 types type-checked end-to-end. Extending this list
# (and the matching PHONE_TYPES tuple in app/owners/models.py) is the only
# change needed to add a new type — no migration, since the underlying
# column is a plain string, not a Postgres ENUM.
PhoneType = Literal["public", "whatsapp", "private"]


class OwnerPhoneNumberIn(BaseModel):
    type: PhoneType
    number: str = Field(min_length=6, max_length=20)


class OwnerPhoneNumberOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    type: str
    number: str


class OwnerBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: str | None = None
    notes: str = ""


class OwnerCreate(OwnerBase):
    phone_numbers: list[OwnerPhoneNumberIn] = Field(default_factory=list)

    @field_validator("phone_numbers")
    @classmethod
    def unique_types(cls, value: list[OwnerPhoneNumberIn]) -> list[OwnerPhoneNumberIn]:
        types = [p.type for p in value]
        if len(types) != len(set(types)):
            raise ValueError("Each phone type (public/whatsapp/private) can only be set once")
        return value


class OwnerUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: str | None = None
    notes: str | None = None
    # When provided, replaces the owner's entire phone number set.
    phone_numbers: list[OwnerPhoneNumberIn] | None = None

    @field_validator("phone_numbers")
    @classmethod
    def unique_types(cls, value: list[OwnerPhoneNumberIn] | None) -> list[OwnerPhoneNumberIn] | None:
        if value is None:
            return value
        types = [p.type for p in value]
        if len(types) != len(set(types)):
            raise ValueError("Each phone type (public/whatsapp/private) can only be set once")
        return value


class OwnerOut(OwnerBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    pg_count: int = 0
    phone_numbers: list[OwnerPhoneNumberOut] = Field(default_factory=list)
    created_at: datetime
    updated_at: datetime
