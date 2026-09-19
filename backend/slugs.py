"""Geração de slugs únicos a partir de texto livre (títulos com acentos, etc.)."""

import re
import unicodedata
import uuid

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[^\w\s-]", "", value).strip().lower()
    value = re.sub(r"[-\s]+", "-", value).strip("-")
    return value or "item"


async def unique_slug(
    session: AsyncSession,
    model,
    source: str,
    exclude_id: uuid.UUID | None = None,
) -> str:
    """Slugifica `source` e acrescenta `-2`, `-3`, ... até não colidir com nenhum
    registo existente (ignorando o próprio registo em edições)."""
    base = slugify(source)
    candidate = base
    suffix = 2
    while True:
        query = select(model.id).where(model.slug == candidate)
        if exclude_id is not None:
            query = query.where(model.id != exclude_id)
        if await session.scalar(query) is None:
            return candidate
        candidate = f"{base}-{suffix}"
        suffix += 1
