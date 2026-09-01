"""seed initial admin user

Revision ID: 0002_seed_admin_user
Revises: 0001_initial_schema
Create Date: 2026-08-31

The bcrypt hash below was generated locally (no DB connection) via:
    python -c "import bcrypt; print(bcrypt.hashpw(b'8179828084', bcrypt.gensalt()).decode())"
It corresponds to the plaintext password '8179828084' for srstay@admin.com.
Change this password after first login in production.
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "0002_seed_admin_user"
down_revision: Union[str, None] = "0001_initial_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

ADMIN_ID = "58ce0aa6-f0c3-4ce4-afc0-7a67fce4bf23"
ADMIN_EMAIL = "srstay@admin.com"
ADMIN_PASSWORD_HASH = "$2b$12$VAF0z8z5WeZtmSW0nj9v2ur1OB5NqWXI50cz.4SvehX4ZCuTtj0G6"

admin_users = sa.table(
    "admin_users",
    sa.column("id", postgresql.UUID(as_uuid=True)),
    sa.column("email", sa.String),
    sa.column("hashed_password", sa.String),
)


def upgrade() -> None:
    op.bulk_insert(
        admin_users,
        [{"id": ADMIN_ID, "email": ADMIN_EMAIL, "hashed_password": ADMIN_PASSWORD_HASH}],
    )


def downgrade() -> None:
    op.execute(admin_users.delete().where(admin_users.c.email == ADMIN_EMAIL))
