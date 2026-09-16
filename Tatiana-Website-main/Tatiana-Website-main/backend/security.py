"""Hashing de passwords, emissão/validação de JWT e dependency de autenticação."""

import os
import uuid
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models import AdminUser

JWT_SECRET = os.environ.get("JWT_SECRET", "")
JWT_ALGORITHM = "HS256"
TOKEN_TTL_DAYS = int(os.environ.get("JWT_TTL_DAYS", "7"))

COOKIE_NAME = "admin_session"
# Em desenvolvimento o frontend corre em http://localhost:3000 e o cookie não pode
# exigir HTTPS; em produção (Vercel) exige.
IS_DEV = os.environ.get("APP_ENV", "development") == "development"


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        # hash malformado na base de dados — trata como credencial inválida
        return False


def create_access_token(user_id: uuid.UUID) -> str:
    if not JWT_SECRET:
        raise RuntimeError("JWT_SECRET não definido — o login não pode emitir tokens.")
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + timedelta(days=TOKEN_TTL_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=not IS_DEV,
        samesite="lax",
        max_age=TOKEN_TTL_DAYS * 24 * 60 * 60,
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(key=COOKIE_NAME, path="/")


def _extract_token(request: Request) -> str | None:
    token = request.cookies.get(COOKIE_NAME)
    if token:
        return token
    # Alternativa para clientes que não usam cookies (testes, curl, futuros integradores)
    header = request.headers.get("Authorization", "")
    if header.startswith("Bearer "):
        return header[7:].strip()
    return None


async def get_current_admin(
    request: Request,
    session: AsyncSession = Depends(get_session),
) -> AdminUser:
    """Protege as rotas do painel. Devolve 401 se não houver sessão válida."""
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Sessão inválida ou expirada.",
    )

    token = _extract_token(request)
    if not token or not JWT_SECRET:
        raise unauthorized

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = uuid.UUID(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise unauthorized

    user = await session.scalar(select(AdminUser).where(AdminUser.id == user_id))
    if user is None or not user.is_active:
        raise unauthorized
    return user
