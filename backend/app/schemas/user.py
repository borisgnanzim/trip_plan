from pydantic import BaseModel, ConfigDict, EmailStr, Field

PASSWORD_FIELD = Field(..., min_length=8, max_length=72, description="Le mot de passe doit contenir entre 8 et 72 caractères.")


class UserCreate(BaseModel):
    email: EmailStr
    password: str = PASSWORD_FIELD


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = PASSWORD_FIELD


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
