from fastapi import HTTPException
from app.models.user import User
from app.core.security import hash_password, verify_password, create_token

def register_user(payload, db):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email déjà utilisé")

    user = User(email=payload.email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def login_user(payload, db):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(401, "Identifiants invalides")

    return create_token(user.id)
