"""Guarda ficheiros enviados pelo painel (imagens/vídeo das aulas, capa do blog).

Em desenvolvimento local guarda em disco (`backend/uploads/`), servido como
estático pelo FastAPI. A decisão para produção é Vercel Blob Storage — quando
o backend for para lá, troca-se apenas esta função; nada mais no painel muda,
porque tudo consome só o `url` devolvido por `save_upload`.
"""

import uuid
from pathlib import Path
from typing import TypedDict

from fastapi import UploadFile

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50MB — chega para os vídeos curtos das aulas
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"}
CHUNK_SIZE = 1024 * 1024


class UploadResult(TypedDict):
    url: str
    filename: str
    size: int


def _safe_extension(filename: str) -> str:
    ext = Path(filename or "").suffix.lower()
    return ext if ext in ALLOWED_EXTENSIONS else ""


async def save_upload(file: UploadFile, *, base_url: str) -> UploadResult:
    ext = _safe_extension(file.filename or "")
    if not ext:
        raise ValueError(
            "Tipo de ficheiro não suportado. Use imagem (jpg, png, webp, gif) ou vídeo (mp4, webm, mov)."
        )

    name = f"{uuid.uuid4().hex}{ext}"
    dest = UPLOAD_DIR / name

    size = 0
    try:
        with dest.open("wb") as out:
            while chunk := await file.read(CHUNK_SIZE):
                size += len(chunk)
                if size > MAX_UPLOAD_BYTES:
                    raise ValueError("Ficheiro demasiado grande (máximo 50MB).")
                out.write(chunk)
    except ValueError:
        dest.unlink(missing_ok=True)
        raise
    except Exception:
        dest.unlink(missing_ok=True)
        raise

    return {"url": f"{base_url}/uploads/{name}", "filename": name, "size": size}
