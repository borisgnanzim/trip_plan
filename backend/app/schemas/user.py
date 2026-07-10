from pydantic import BaseModel, EmailStr, Field

PASSWORD_FIELD = Field(..., min_length=8, max_length=72, description="Le mot de passe doit contenir entre 8 et 72 caractères.")

class UserCreate(BaseModel):
    email: EmailStr
    password: str = PASSWORD_FIELD

class UserOut(BaseModel):
    id: int
    email: EmailStr
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = PASSWORD_FIELD

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
