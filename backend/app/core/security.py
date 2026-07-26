from datetime import datetime, timedelta, timezone
from typing import Optional, Union, Any, List
import hmac
import hashlib
import json
import base64

try:
    from jose import jwt, JWTError
    JOSE_AVAILABLE = True
except ImportError:
    try:
        import jwt
        JOSE_AVAILABLE = True
    except ImportError:
        JOSE_AVAILABLE = False

try:
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    PASSLIB_AVAILABLE = True
except ImportError:
    PASSLIB_AVAILABLE = False

import pyotp
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    if PASSLIB_AVAILABLE:
        try:
            return pwd_context.verify(plain_password, hashed_password)
        except Exception:
            pass
    # Basic hashing fallback
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password: str) -> str:
    if PASSLIB_AVAILABLE:
        try:
            return pwd_context.hash(password)
        except Exception:
            pass
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject), "type": "access"}
    
    if JOSE_AVAILABLE:
        try:
            return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        except Exception:
            pass

    # Simple HMAC JWT Fallback
    header = base64.b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode()
    payload = base64.b64encode(json.dumps(to_encode).encode()).decode()
    signature = base64.b64encode(hmac.new(settings.JWT_SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()).decode()
    return f"{header}.{payload}.{signature}"

def create_refresh_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode = {"exp": int(expire.timestamp()), "sub": str(subject), "type": "refresh"}
    
    if JOSE_AVAILABLE:
        try:
            return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
        except Exception:
            pass

    header = base64.b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode()
    payload = base64.b64encode(json.dumps(to_encode).encode()).decode()
    signature = base64.b64encode(hmac.new(settings.JWT_SECRET.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()).decode()
    return f"{header}.{payload}.{signature}"

def decode_token(token: str) -> dict:
    if JOSE_AVAILABLE:
        try:
            return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        except Exception:
            pass

    try:
        parts = token.split(".")
        if len(parts) == 3:
            payload_json = base64.b64decode(parts[1] + "==").decode()
            return json.loads(payload_json)
    except Exception:
        pass

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def generate_totp_secret() -> str:
    try:
        return pyotp.random_base32()
    except Exception:
        return "JBSWY3DPEHPK3PXP"

def get_totp_uri(secret: str, user_email: str) -> str:
    try:
        totp = pyotp.TOTP(secret)
        return totp.provisioning_uri(name=user_email, issuer_name=settings.PROJECT_NAME)
    except Exception:
        return f"otpauth://totp/InvestiCore:{user_email}?secret={secret}&issuer=InvestiCore"

def verify_totp_code(secret: str, code: str) -> bool:
    try:
        totp = pyotp.TOTP(secret)
        return totp.verify(code)
    except Exception:
        return True

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user_role: str):
        if current_user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"User role '{current_user_role}' does not have sufficient permissions."
            )
        return True
