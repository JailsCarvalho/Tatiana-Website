"""Upload de imagens/vídeo para o painel (capa do blog, vídeos das aulas).

Um único pedido para ficheiros pequenos; em partes para ficheiros grandes —
ver storage.py para o porquê (limite de 4.5MB por pedido na Vercel).
"""

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from pydantic import BaseModel

from models import AdminUser
from schemas import UploadOut
from security import get_current_admin
from storage import multipart_complete, multipart_part, multipart_start, save_upload

router = APIRouter(prefix="/admin/uploads", tags=["admin:uploads"])


@router.post("", response_model=UploadOut, status_code=status.HTTP_201_CREATED)
async def upload_file(
    request: Request,
    file: UploadFile,
    _: AdminUser = Depends(get_current_admin),
):
    try:
        return await save_upload(file, base_url=str(request.base_url).rstrip("/"))
    except ValueError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc


class MultipartStartIn(BaseModel):
    filename: str


@router.post("/multipart/start")
async def start_multipart(
    payload: MultipartStartIn,
    _: AdminUser = Depends(get_current_admin),
):
    try:
        return await multipart_start(payload.filename)
    except ValueError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc


@router.post("/multipart/part")
async def upload_multipart_part(
    upload_id: str = Form(...),
    key: str = Form(...),
    part_number: int = Form(...),
    chunk: UploadFile = File(...),
    _: AdminUser = Depends(get_current_admin),
):
    data = await chunk.read()
    try:
        return await multipart_part(upload_id=upload_id, key=key, part_number=part_number, chunk=data)
    except ValueError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc


class PartIn(BaseModel):
    part_number: int
    etag: str | None = None


class MultipartCompleteIn(BaseModel):
    upload_id: str
    key: str
    parts: list[PartIn]


@router.post("/multipart/complete", response_model=UploadOut)
async def complete_multipart(
    request: Request,
    payload: MultipartCompleteIn,
    _: AdminUser = Depends(get_current_admin),
):
    try:
        return await multipart_complete(
            upload_id=payload.upload_id,
            key=payload.key,
            parts=[p.model_dump() for p in payload.parts],
            base_url=str(request.base_url).rstrip("/"),
        )
    except ValueError as exc:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, str(exc)) from exc
