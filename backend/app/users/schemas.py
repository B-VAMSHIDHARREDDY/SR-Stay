import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.pgs.models import Gender


class UserLogin(BaseModel):
    """Phone-only login: no OTP or password check yet — a placeholder auth
    scheme per explicit product decision. Anyone entering a number can log
    into (or silently create) that account. Do not treat this as secure."""

    phone: str = Field(min_length=10, max_length=15, pattern=r"^\d{10,15}$")


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = None
    gender: Gender | None = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    phone: str
    name: str | None
    email: str | None
    gender: Gender | None
    created_at: datetime
