import asyncio
import os
import sys
from logging.config import fileConfig
from pathlib import Path

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import create_async_engine

from alembic import context

# backend/ no path para que `database` e `models` sejam importáveis daqui
BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

from database import DATABASE_URL, Base  # noqa: E402
import models  # noqa: E402,F401  (import necessário para o autogenerate ver as tabelas)

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def migration_url() -> str:
    """URL usado pelas migrações.

    As migrações correm contra o endpoint directo da Neon (sem `-pooler`): o
    PgBouncer em transaction mode não é o sítio certo para DDL. Se existir um
    DATABASE_URL_DIRECT explícito, é esse que manda.
    """
    explicit = os.environ.get("DATABASE_URL_DIRECT")
    if explicit:
        return explicit
    return DATABASE_URL.replace("-pooler.", ".")


def run_migrations_offline() -> None:
    context.configure(
        url=migration_url(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def do_run_migrations(connection: Connection) -> None:
    context.configure(connection=connection, target_metadata=target_metadata)

    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    connectable = create_async_engine(
        migration_url(),
        poolclass=pool.NullPool,
        connect_args={"statement_cache_size": 0},
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    asyncio.run(run_async_migrations())


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
