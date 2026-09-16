"""CRUD de workshops para o painel. Todas as rotas exigem sessão de admin."""

import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from models import AdminUser, Workshop
from schemas import WorkshopAdminOut, WorkshopIn
from security import get_current_admin
from slugs import unique_slug

router = APIRouter(prefix="/admin/workshops", tags=["admin:workshops"])


async def _get_or_404(session: AsyncSession, workshop_id: uuid.UUID) -> Workshop:
    workshop = await session.get(Workshop, workshop_id)
    if workshop is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Workshop não encontrado.")
    return workshop


@router.get("", response_model=List[WorkshopAdminOut])
async def list_workshops(
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    rows = await session.scalars(
        select(Workshop).order_by(Workshop.sort_order, Workshop.created_at)
    )
    return list(rows)


@router.post("", response_model=WorkshopAdminOut, status_code=status.HTTP_201_CREATED)
async def create_workshop(
    payload: WorkshopIn,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    slug = await unique_slug(session, Workshop, payload.slug or payload.title)
    workshop = Workshop(**payload.model_dump(exclude={"slug"}), slug=slug)
    session.add(workshop)
    await session.flush()
    return workshop


@router.get("/{workshop_id}", response_model=WorkshopAdminOut)
async def get_workshop(
    workshop_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    return await _get_or_404(session, workshop_id)


@router.put("/{workshop_id}", response_model=WorkshopAdminOut)
async def update_workshop(
    workshop_id: uuid.UUID,
    payload: WorkshopIn,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    workshop = await _get_or_404(session, workshop_id)

    for key, value in payload.model_dump(exclude={"slug"}).items():
        setattr(workshop, key, value)

    if payload.slug and payload.slug != workshop.slug:
        workshop.slug = await unique_slug(
            session, Workshop, payload.slug, exclude_id=workshop.id
        )

    await session.flush()
    return workshop


@router.delete("/{workshop_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workshop(
    workshop_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    workshop = await _get_or_404(session, workshop_id)
    await session.delete(workshop)
