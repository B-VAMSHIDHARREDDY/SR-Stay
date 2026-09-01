from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.schemas import TokenResponse
from app.auth.services import create_access_token
from app.database import get_db
from app.users import services
from app.users.models import User
from app.users.schemas import UserLogin, UserOut, UserUpdate
from app.users.services import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/login", response_model=TokenResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> TokenResponse:
    user = services.get_or_create_user(db, payload.phone)
    token, expires_in = create_access_token(user.id)
    return TokenResponse(access_token=token, expires_in=expires_in)


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)) -> User:
    return current_user


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    return services.update_user(db, current_user, payload.model_dump(exclude_unset=True))
