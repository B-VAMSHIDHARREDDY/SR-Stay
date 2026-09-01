from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth.routes import router as auth_router
from app.config import get_settings
from app.pgs.routes import admin_router as pgs_admin_router
from app.pgs.routes import public_router as pgs_public_router
from app.users.routes import router as users_router

settings = get_settings()

app = FastAPI(title="SR Stays API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pgs_public_router)
app.include_router(auth_router)
app.include_router(pgs_admin_router)
app.include_router(users_router)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
