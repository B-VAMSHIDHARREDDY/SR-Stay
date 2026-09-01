from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.auth.models import AdminUser
from app.auth.schemas import AdminLogin, AdminOut, TokenResponse
from app.auth.services import create_access_token, get_current_admin, verify_password
from app.database import get_db

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=TokenResponse)
def login(payload: AdminLogin, db: Session = Depends(get_db)) -> TokenResponse:
    admin = db.scalar(select(AdminUser).where(AdminUser.email == payload.email.lower()))
    if admin is None or not verify_password(payload.password, admin.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token, expires_in = create_access_token(admin.id)
    return TokenResponse(access_token=token, expires_in=expires_in)


@router.get("/me", response_model=AdminOut)
def me(current_admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
    return current_admin
