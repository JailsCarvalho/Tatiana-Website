"""Upload de imagens/vídeo para o painel (capa do blog, vídeos das aulas)."""

from fastapi import APIRouter, Depends, HTTPException, Request, UploadFile, status

from models import AdminUser
from schemas import UploadOut
from security import get_current_admin
from storage import save_upload

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
