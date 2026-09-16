"""Ligação à base de dados (Neon / Postgres) e sessão async partilhada."""

import os
from pathlib import Path
from typing import AsyncGenerator

from dotenv import load_dotenv
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

DATABASE_URL = os.environ["DATABASE_URL"]


class Base(DeclarativeBase):
    """Base declarativa de todos os modelos."""


# O endpoint com `-pooler` da Neon é um PgBouncer em transaction mode: não mantém
# a sessão entre queries, por isso os prepared statements que o asyncpg guarda por
# omissão rebentam com "prepared statement does not exist". Ambas as caches (a do
# asyncpg e a do dialecto SQLAlchemy) têm de ficar desligadas — a do dialecto só
# pode ser desligada pela query string do URL, não por argumento do create_engine.
# NullPool porque quem faz pooling é a Neon do lado do servidor — manter um pool
# local por invocação serverless só esgotaria ligações.
engine = create_async_engine(
    make_url(DATABASE_URL).update_query_dict({"prepared_statement_cache_size": "0"}),
    poolclass=NullPool,
    connect_args={"statement_cache_size": 0},
)

SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency FastAPI: uma sessão por pedido, com commit/rollback automático."""
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
