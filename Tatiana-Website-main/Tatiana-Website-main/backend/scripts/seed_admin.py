"""Cria (ou actualiza) o utilizador do painel de administração.

Não há registo público: as contas do painel nascem sempre por aqui.

    python scripts/seed_admin.py --email tatiana@exemplo.pt --password "..." --name "Tatiana"

Sem --password é gerada uma password forte e mostrada no fim (só uma vez).
"""

import argparse
import asyncio
import secrets
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select  # noqa: E402

from database import SessionLocal, engine  # noqa: E402
from models import AdminUser  # noqa: E402
from security import hash_password  # noqa: E402


async def upsert_admin(email: str, password: str, name: str | None) -> str:
    email = email.strip().lower()
    async with SessionLocal() as session:
        user = await session.scalar(select(AdminUser).where(AdminUser.email == email))
        if user is None:
            session.add(
                AdminUser(
                    email=email,
                    password_hash=hash_password(password),
                    name=name,
                    is_active=True,
                )
            )
            action = "criado"
        else:
            user.password_hash = hash_password(password)
            user.is_active = True
            if name:
                user.name = name
            action = "actualizado"
        await session.commit()
    return action


async def main() -> None:
    parser = argparse.ArgumentParser(description="Cria ou actualiza um utilizador do painel.")
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", default=None)
    parser.add_argument("--name", default=None)
    args = parser.parse_args()

    password = args.password or secrets.token_urlsafe(12)
    generated = args.password is None

    try:
        action = await upsert_admin(args.email, password, args.name)
    finally:
        await engine.dispose()

    print(f"Utilizador {action}: {args.email}")
    if generated:
        print(f"Password gerada: {password}")
        print("Guarde-a agora — não volta a ser mostrada.")


if __name__ == "__main__":
    asyncio.run(main())
