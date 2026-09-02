"""add owners table and link pg_listings to it

Revision ID: 0005_add_owners_table
Revises: 0004_add_amenities_table
Create Date: 2026-09-02

owner_id is nullable and ON DELETE SET NULL: existing listings start
unowned, and deleting an owner unlinks their PGs rather than deleting them.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0005_add_owners_table"
down_revision: Union[str, None] = "0004_add_amenities_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "owners",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("notes", sa.Text(), nullable=False, server_default=""),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_owners_phone", "owners", ["phone"], unique=True)

    op.add_column("pg_listings", sa.Column("owner_id", postgresql.UUID(as_uuid=True), nullable=True))
    op.create_index("ix_pg_listings_owner_id", "pg_listings", ["owner_id"])
    op.create_foreign_key(
        "fk_pg_listings_owner_id_owners",
        "pg_listings",
        "owners",
        ["owner_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_pg_listings_owner_id_owners", "pg_listings", type_="foreignkey")
    op.drop_index("ix_pg_listings_owner_id", table_name="pg_listings")
    op.drop_column("pg_listings", "owner_id")

    op.drop_index("ix_owners_phone", table_name="owners")
    op.drop_table("owners")
