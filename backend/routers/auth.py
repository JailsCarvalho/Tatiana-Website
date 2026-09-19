"""Autenticação do painel de administração."""

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models import AdminUser
from schemas import AdminUserOut, LoginRequest
from security import (
    clear_session_cookie,
    create_access_token,
    get_current_admin,
    hash_password,
    set_session_cookie,
    verify_password,
)

router = APIRouter(prefix="/auth", tags=["auth"])

# Hash descartável, usado quando o email não existe, para que uma tentativa com
# email inexistente demore o mesmo que uma com password errada (não revela quais
# emails estão registados).
_DUMMY_HASH = hash_password("verificacao-em-tempo-constante")


@router.post("/login", response_model=AdminUserOut)
async def login(
    payload: LoginRequest,
    response: Response,
    session: AsyncSession = Depends(get_session),
):
    email = payload.email.strip().lower()
    user = await session.scalar(select(AdminUser).where(AdminUser.email == email))

    password_ok = verify_password(payload.password, user.password_hash if user else _DUMMY_HASH)
    if user is None or not password_ok or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou password incorrectos.",
        )

    set_session_cookie(response, create_access_token(user.id))
    return user


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(response: Response):
    # O cookie é limpo no `response` injectado — devolver um Response novo aqui
    # perderia o header Set-Cookie.
    clear_session_cookie(response)


@router.get("/me", response_model=AdminUserOut)
async def me(current: AdminUser = Depends(get_current_admin)):
    return current
