"""initial schema: admin_users, pg_listings

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-31

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

pg_gender = postgresql.ENUM("male", "female", "unisex", name="pg_gender", create_type=False)


def upgrade() -> None:
    op.create_table(
        "admin_users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_admin_users_email", "admin_users", ["email"], unique=True)

    pg_gender.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "pg_listings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("city", sa.String(length=100), nullable=False),
        sa.Column("locality", sa.String(length=150), nullable=False),
        sa.Column("address", sa.Text(), nullable=False),
        sa.Column("gender", pg_gender, nullable=False),
        sa.Column("price_monthly", sa.Integer(), nullable=False),
        sa.Column("security_deposit", sa.Integer(), nullable=True),
        sa.Column("sharing_types", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("amenities", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("images", postgresql.JSONB(), nullable=False, server_default="[]"),
        sa.Column("contact_phone", sa.String(length=20), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )
    op.create_index("ix_pg_listings_city", "pg_listings", ["city"])
    op.create_index("ix_pg_listings_locality", "pg_listings", ["locality"])
    op.create_index("ix_pg_listings_is_active", "pg_listings", ["is_active"])


def downgrade() -> None:
    op.drop_index("ix_pg_listings_is_active", table_name="pg_listings")
    op.drop_index("ix_pg_listings_locality", table_name="pg_listings")
    op.drop_index("ix_pg_listings_city", table_name="pg_listings")
    op.drop_table("pg_listings")

    pg_gender.drop(op.get_bind(), checkfirst=True)

    op.drop_index("ix_admin_users_email", table_name="admin_users")
    op.drop_table("admin_users")
