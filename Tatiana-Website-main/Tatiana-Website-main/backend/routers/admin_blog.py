"""CRUD de artigos do blog para o painel. Todas as rotas exigem sessão de admin."""

import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models import AdminUser, BlogPost
from schemas import BlogPostAdminOut, BlogPostIn
from security import get_current_admin
from slugs import unique_slug

router = APIRouter(prefix="/admin/blog", tags=["admin:blog"])


async def _get_or_404(session: AsyncSession, post_id: uuid.UUID) -> BlogPost:
    post = await session.get(BlogPost, post_id)
    if post is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Artigo não encontrado.")
    return post


@router.get("", response_model=List[BlogPostAdminOut])
async def list_posts(
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    rows = await session.scalars(select(BlogPost).order_by(BlogPost.created_at.desc()))
    return list(rows)


@router.post("", response_model=BlogPostAdminOut, status_code=status.HTTP_201_CREATED)
async def create_post(
    payload: BlogPostIn,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    slug = await unique_slug(session, BlogPost, payload.slug or payload.title)
    post = BlogPost(**payload.model_dump(exclude={"slug"}), slug=slug)
    # A data de publicação marca-se ao publicar pela primeira vez, não em cada
    # edição — é o que a listagem pública usa para ordenar e mostrar a data.
    if post.published:
        post.published_at = datetime.now(timezone.utc)
    session.add(post)
    await session.flush()
    return post


@router.get("/{post_id}", response_model=BlogPostAdminOut)
async def get_post(
    post_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    return await _get_or_404(session, post_id)


@router.put("/{post_id}", response_model=BlogPostAdminOut)
async def update_post(
    post_id: uuid.UUID,
    payload: BlogPostIn,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    post = await _get_or_404(session, post_id)
    was_published = post.published

    for key, value in payload.model_dump(exclude={"slug"}).items():
        setattr(post, key, value)

    if payload.slug and payload.slug != post.slug:
        post.slug = await unique_slug(session, BlogPost, payload.slug, exclude_id=post.id)

    if post.published and not was_published:
        post.published_at = datetime.now(timezone.utc)

    await session.flush()
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    post = await _get_or_404(session, post_id)
    await session.delete(post)
