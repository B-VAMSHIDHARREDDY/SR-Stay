"""owner phone numbers, drop legacy single-phone columns

Revision ID: 0006_owner_phone_numbers
Revises: 0005_add_owners_table
Create Date: 2026-09-02

Moves contact info to the Owner: `owner_phone_numbers` holds one row per
(owner, type) — public/whatsapp/private today, and any future type needs no
migration since `type` is a plain string, not a Postgres ENUM.

Backfills any existing `owners.phone` value as a `public` row before
dropping that column. `pg_listings.contact_phone` is dropped outright —
listing-level contact info is superseded by the linked owner's phone
numbers (see app/pgs/services.py's _attach_owner_phones).
"""
import uuid
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0006_owner_phone_numbers"
down_revision: Union[str, None] = "0005_add_owners_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "owner_phone_numbers",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column(
            "owner_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("owners.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("type", sa.String(length=30), nullable=False),
        sa.Column("number", sa.String(length=20), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.UniqueConstraint("owner_id", "type", name="uq_owner_phone_type"),
    )
    op.create_index("ix_owner_phone_numbers_owner_id", "owner_phone_numbers", ["owner_id"])

    connection = op.get_bind()
    owners = sa.table("owners", sa.column("id", postgresql.UUID(as_uuid=True)), sa.column("phone", sa.String))
    phone_numbers = sa.table(
        "owner_phone_numbers",
        sa.column("id", postgresql.UUID(as_uuid=True)),
        sa.column("owner_id", postgresql.UUID(as_uuid=True)),
        sa.column("type", sa.String),
        sa.column("number", sa.String),
    )
    existing = connection.execute(sa.select(owners.c.id, owners.c.phone)).fetchall()
    if existing:
        connection.execute(
            phone_numbers.insert(),
            [{"id": uuid.uuid4(), "owner_id": row.id, "type": "public", "number": row.phone} for row in existing],
        )

    op.drop_index("ix_owners_phone", table_name="owners")
    op.drop_column("owners", "phone")

    op.drop_column("pg_listings", "contact_phone")


def downgrade() -> None:
    op.add_column("pg_listings", sa.Column("contact_phone", sa.String(length=20), nullable=False, server_default=""))
    op.alter_column("pg_listings", "contact_phone", server_default=None)

    op.add_column("owners", sa.Column("phone", sa.String(length=20), nullable=True))

    connection = op.get_bind()
    owners = sa.table("owners", sa.column("id", postgresql.UUID(as_uuid=True)), sa.column("phone", sa.String))
    phone_numbers = sa.table(
        "owner_phone_numbers",
        sa.column("owner_id", postgresql.UUID(as_uuid=True)),
        sa.column("type", sa.String),
        sa.column("number", sa.String),
    )
    public_numbers = connection.execute(
        sa.select(phone_numbers.c.owner_id, phone_numbers.c.number).where(phone_numbers.c.type == "public")
    ).fetchall()
    for row in public_numbers:
        connection.execute(owners.update().where(owners.c.id == row.owner_id).values(phone=row.number))

    op.alter_column("owners", "phone", nullable=False, server_default="0000000000")
    op.alter_column("owners", "phone", server_default=None)
    op.create_index("ix_owners_phone", "owners", ["phone"], unique=True)

    op.drop_index("ix_owner_phone_numbers_owner_id", table_name="owner_phone_numbers")
    op.drop_table("owner_phone_numbers")
