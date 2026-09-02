"""add amenities table

Revision ID: 0004_add_amenities_table
Revises: 0003_add_users_table
Create Date: 2026-09-02

Seeds the same 6 options that were previously hardcoded in the frontend's
AMENITY_OPTIONS constant (pg-filters-bar.tsx), so existing listings' free-text
`pg_listings.amenities` values keep matching after the admin form switches to
picking from this table instead of typing free text.
"""
import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0004_add_amenities_table"
down_revision: Union[str, None] = "0003_add_users_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

amenities = sa.table(
    "amenities",
    sa.column("id", postgresql.UUID(as_uuid=True)),
    sa.column("name", sa.String),
)

SEED_NAMES = ["WiFi", "Food", "AC", "Laundry", "Power Backup", "Parking"]


def upgrade() -> None:
    op.create_table(
        "amenities",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_amenities_name", "amenities", ["name"], unique=True)

    op.bulk_insert(amenities, [{"id": uuid.uuid4(), "name": name} for name in SEED_NAMES])


def downgrade() -> None:
    op.drop_index("ix_amenities_name", table_name="amenities")
    op.drop_table("amenities")
