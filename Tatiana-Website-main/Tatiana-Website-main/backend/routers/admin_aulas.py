"""CRUD de aulas/técnicas para o painel. Todas as rotas exigem sessão de admin."""

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models import Aula, AdminUser
from schemas import AulaAdminOut, AulaIn
from security import get_current_admin
from slugs import unique_slug

router = APIRouter(prefix="/admin/aulas", tags=["admin:aulas"])


async def _get_or_404(session: AsyncSession, aula_id: uuid.UUID) -> Aula:
    aula = await session.get(Aula, aula_id)
    if aula is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Aula não encontrada.")
    return aula


@router.get("", response_model=List[AulaAdminOut])
async def list_aulas(
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    rows = await session.scalars(select(Aula).order_by(Aula.sort_order, Aula.created_at))
    return list(rows)


@router.post("", response_model=AulaAdminOut, status_code=status.HTTP_201_CREATED)
async def create_aula(
    payload: AulaIn,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    slug = await unique_slug(session, Aula, payload.slug or payload.title)
    aula = Aula(**payload.model_dump(exclude={"slug"}), slug=slug)
    session.add(aula)
    await session.flush()
    return aula


@router.get("/{aula_id}", response_model=AulaAdminOut)
async def get_aula(
    aula_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    return await _get_or_404(session, aula_id)


@router.put("/{aula_id}", response_model=AulaAdminOut)
async def update_aula(
    aula_id: uuid.UUID,
    payload: AulaIn,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    aula = await _get_or_404(session, aula_id)

    for key, value in payload.model_dump(exclude={"slug"}).items():
        setattr(aula, key, value)

    if payload.slug and payload.slug != aula.slug:
        aula.slug = await unique_slug(session, Aula, payload.slug, exclude_id=aula.id)

    await session.flush()
    return aula


@router.delete("/{aula_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_aula(
    aula_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    aula = await _get_or_404(session, aula_id)
    await session.delete(aula)
