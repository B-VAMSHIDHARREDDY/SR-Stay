# SR Stays API

FastAPI backend for SR Stays: public PG search + an admin API for managing listings, backed by Postgres.

## Setup

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # Windows (PowerShell: .venv\Scripts\Activate.ps1)
# source .venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
```

`.env` already exists in this directory (gitignored) with the real `DATABASE_URL`, a generated `JWT_SECRET`, and `CORS_ORIGINS`. Copy `.env.example` if you ever need to point at a different database.

## Migrations

Migrations are written but have **not been run**. Review `alembic/versions/0001_initial_schema.py` (creates `admin_users` + `pg_listings`) and `alembic/versions/0002_seed_admin_user.py` (seeds `srstay@admin.com` / `8179828084`, stored as a bcrypt hash) before applying them.

```bash
# Preview the exact SQL without touching the database:
alembic upgrade head --sql

# Apply for real, once you're ready:
alembic upgrade head
```

**Change the seed admin's password after first login** — it's a known default.

## Run locally

```bash
uvicorn app.main:app --reload --port 8001
```

API docs at `http://localhost:8001/docs`.

Port 8000 is used by default in some local setups (e.g. Django) — this project runs on 8001 to avoid clashing with that. Match `NEXT_PUBLIC_API_BASE_URL` in `frontend/.env.local` to whatever port you actually run this on.

## Key endpoints

- `GET /api/pgs?city=&locality=&q=&gender=&min_price=&max_price=&page=&page_size=` — public search (active listings only)
- `GET /api/pgs/{id}` — public listing detail
- `POST /api/admin/login` — `{ email, password }` -> `{ access_token, token_type, expires_in }`
- `GET /api/admin/me` — current admin (requires `Authorization: Bearer <token>`)
- `GET/POST /api/admin/pgs`, `PUT/DELETE /api/admin/pgs/{id}` — admin CRUD (requires bearer token)
