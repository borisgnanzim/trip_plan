from fastapi import APIRouter, Depends
from app.schemas.user import UserCreate, UserOut, LoginRequest, TokenResponse
from app.core.database import get_db
from app.controllers.auth_controller import register_user, login_user

router = APIRouter()

@router.post("/users", response_model=UserOut)
def register(payload: UserCreate, db=Depends(get_db)):
    return register_user(payload, db)

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db=Depends(get_db)):
    token = login_user(payload, db)
    return TokenResponse(access_token=token)
