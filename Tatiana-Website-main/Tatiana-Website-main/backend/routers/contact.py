"""Formulário de contacto: recepção pública e leitura restrita ao painel."""

import logging
from typing import List

import httpx
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session
from email_service import GALLERY_OWNER_EMAIL, build_email_html, send_email_via_emergent
from models import AdminUser, ContactMessage
from schemas import ContactMessageCreate, ContactMessageOut
from security import get_current_admin

router = APIRouter(tags=["contacto"])
logger = logging.getLogger(__name__)


@router.post("/contact", response_model=ContactMessageOut)
async def create_contact(
    payload: ContactMessageCreate,
    session: AsyncSession = Depends(get_session),
):
    message = ContactMessage(
        name=payload.name.strip(),
        email=str(payload.email),
        subject=(payload.subject or "Contacto do website").strip(),
        message=payload.message.strip(),
        topic=payload.topic or "general",
        email_sent=False,
    )

    # O email é um extra: se falhar, a mensagem fica na mesma guardada.
    try:
        email_id = await send_email_via_emergent(
            to_email=GALLERY_OWNER_EMAIL,
            subject="[Atelier Galeria Ícone] Novo contacto do website",
            html=build_email_html(payload),
            reply_to=str(payload.email),
        )
        message.email_sent = bool(email_id)
    except httpx.HTTPStatusError as exc:
        logger.error("Email send failed: %s %s", exc.response.status_code, exc.response.text)
    except Exception as exc:  # noqa: BLE001 - qualquer falha de email é não-bloqueante
        logger.error("Email send error: %s", exc)

    session.add(message)
    await session.flush()
    return message


@router.get("/contact", response_model=List[ContactMessageOut])
async def list_contacts(
    limit: int = 50,
    session: AsyncSession = Depends(get_session),
    _: AdminUser = Depends(get_current_admin),
):
    """Só para o painel — antes esta listagem estava aberta a qualquer pessoa."""
    limit = max(1, min(limit, 200))
    result = await session.scalars(
        select(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(limit)
    )
    return list(result)
