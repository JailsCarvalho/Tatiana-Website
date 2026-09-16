"""Leitura pública do conteúdo editável no painel (workshops, aulas, blog)."""

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models import Aula, BlogPost, Workshop
from schemas import AulaOut, BlogPostOut, WorkshopOut

router = APIRouter(tags=["conteudo"])


@router.get("/workshops")
async def get_workshops(session: AsyncSession = Depends(get_session)):
    rows = await session.scalars(
        select(Workshop)
        .where(Workshop.published.is_(True))
        .order_by(Workshop.sort_order, Workshop.created_at)
    )
    items = [WorkshopOut.model_validate(row).model_dump(by_alias=True, mode="json") for row in rows]
    return {"items": items}


@router.get("/aulas")
async def get_aulas(session: AsyncSession = Depends(get_session)):
    rows = await session.scalars(
        select(Aula).where(Aula.published.is_(True)).order_by(Aula.sort_order, Aula.created_at)
    )
    items = [AulaOut.model_validate(row).model_dump(by_alias=True, mode="json") for row in rows]
    return {"items": items}


@router.get("/blog")
async def get_blog(session: AsyncSession = Depends(get_session)):
    rows = await session.scalars(
        select(BlogPost)
        .where(BlogPost.published.is_(True))
        .order_by(BlogPost.published_at.desc().nullslast(), BlogPost.created_at.desc())
    )

    items = []
    for position, row in enumerate(rows, start=1):
        post = BlogPostOut.model_validate(row)
        # Campos de apresentação que a listagem editorial do site espera.
        post.number = f"N.º {position:03d}"
        post.date = row.published_at.strftime("%d.%m.%Y") if row.published_at else ""
        post.read = row.read_time
        items.append(post.model_dump(by_alias=True, mode="json"))

    return {"items": items}
