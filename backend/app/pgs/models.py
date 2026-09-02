import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Gender(str, enum.Enum):
    male = "male"
    female = "female"
    unisex = "unisex"


class PGListing(Base):
    __tablename__ = "pg_listings"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    # Matches the slugs in the frontend's src/lib/cities.ts (e.g. "hyderabad", "delhi-ncr").
    city: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    locality: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=False)

    gender: Mapped[Gender] = mapped_column(Enum(Gender, name="pg_gender"), nullable=False)
    price_monthly: Mapped[int] = mapped_column(Integer, nullable=False)
    security_deposit: Mapped[int | None] = mapped_column(Integer, nullable=True)

    sharing_types: Mapped[list[str]] = mapped_column(JSONB, default=list)
    amenities: Mapped[list[str]] = mapped_column(JSONB, default=list)
    images: Mapped[list[str]] = mapped_column(JSONB, default=list)

    description: Mapped[str] = mapped_column(Text, default="")

    # Contact info now lives on the linked Owner (see app/owners/models.py —
    # OwnerPhoneNumber has public/whatsapp/private rows per owner) rather
    # than being duplicated per listing.
    owner_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("owners.id", ondelete="SET NULL"), nullable=True, index=True
    )

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
