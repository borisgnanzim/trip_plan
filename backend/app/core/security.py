import base64
import hashlib
import hmac
import secrets
import json
from datetime import datetime, timedelta
from app.core.config import settings


def hash_password(password: str):
    salt = secrets.token_bytes(16)
    derived_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100_000)
    return f"pbkdf2_sha256$100000${base64.b64encode(salt).decode('utf-8')}${base64.b64encode(derived_key).decode('utf-8')}"


def verify_password(password: str, hashed: str):
    try:
        _, iterations_str, salt_b64, hash_b64 = hashed.split("$", 3)
        iterations = int(iterations_str)
        salt = base64.b64decode(salt_b64.encode("utf-8"))
        expected_hash = base64.b64decode(hash_b64.encode("utf-8"))
        derived_key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
        return hmac.compare_digest(derived_key, expected_hash)
    except Exception:
        return False

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _base64url_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def create_token(user_id: int):
    payload = {
        "sub": str(user_id),
        "exp": int((datetime.utcnow() + timedelta(hours=2)).timestamp())
    }
    header = {"alg": settings.JWT_ALGO, "typ": "JWT"}
    header_segment = _base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_segment = _base64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
    signature = hmac.new(settings.JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()
    return f"{header_segment}.{payload_segment}.{_base64url_encode(signature)}"


def decode_token(token: str):
    try:
        header_segment, payload_segment, signature = token.split(".")
        signing_input = f"{header_segment}.{payload_segment}".encode("utf-8")
        expected_signature = _base64url_encode(
            hmac.new(settings.JWT_SECRET.encode("utf-8"), signing_input, hashlib.sha256).digest()
        )
        if hmac.compare_digest(signature, expected_signature):
            payload = json.loads(_base64url_decode(payload_segment).decode("utf-8"))
            return payload.get("sub")
    except Exception:
        return None
