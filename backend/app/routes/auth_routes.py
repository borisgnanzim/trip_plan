from fastapi import APIRouter, Depends
from app.controllers.auth_controller import login_user, register_user
from app.core.database import get_db
from app.schemas.user import LoginRequest, TokenResponse, UserCreate, UserOut

router = APIRouter()


@router.post("/users", response_model=UserOut)
def register(payload: UserCreate, db=Depends(get_db)):
    return register_user(payload, db)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db=Depends(get_db)):
    token = login_user(payload, db)
    return TokenResponse(access_token=token)
