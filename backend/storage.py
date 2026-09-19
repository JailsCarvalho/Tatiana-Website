"""Guarda ficheiros enviados pelo painel (imagens/vídeo das aulas, capa do blog).

Duas origens, escolhidas em runtime por BLOB_READ_WRITE_TOKEN:
- Sem o token (desenvolvimento local): disco em backend/uploads/, servido
  como estático pelo FastAPI (ver server.py). Uma função serverless não tem
  disco persistente entre pedidos, por isso esta via só serve para dev.
- Com o token (produção na Vercel): Vercel Blob Storage, via o SDK oficial
  `vercel.blob` (pacote `vercel` no requirements.txt).

Duas vias de upload:
- save_upload(): um único pedido — usada para ficheiros pequenos.
- multipart_start/part/complete(): em partes — obrigatório para ficheiros
  grandes, porque as funções da Vercel recusam pedidos acima de 4.5MB. Quem
  decide qual via usar e faz o corte em pedaços é o frontend
  (frontend/src/lib/upload.js); este módulo só executa o que lhe pedem.

NOTA: os métodos do SDK do Blob (put/create_multipart_upload/upload_part/
complete_multipart_upload) foram implementados a partir da documentação
oficial, mas nunca correram contra um Blob store real — não havia token
disponível neste ambiente de desenvolvimento. Antes de confiar nisto em
produção, faça pelo menos um upload de teste (pequeno e grande) já na Vercel.
"""

import mimetypes
import os
import uuid
from pathlib import Path
from typing import TypedDict

from fastapi import UploadFile

UPLOAD_DIR = Path(__file__).parent / "uploads"
try:
    UPLOAD_DIR.mkdir(exist_ok=True)
except OSError:
    # Sistema de ficheiros só de leitura (função serverless). Em produção os
    # uploads vão para a Vercel Blob Storage e esta pasta nunca é usada — não
    # pode ser aqui que o arranque de toda a aplicação fica preso.
    pass

MAX_UPLOAD_BYTES = 80 * 1024 * 1024  # 80MB — chega para vídeos curtos do atelier
# Abaixo disto vai num único pedido; acima, em partes. Fica com margem clara
# sob o limite de 4.5MB que a Vercel impõe a cada pedido de uma função.
SINGLE_SHOT_LIMIT = 4 * 1024 * 1024
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"}
CHUNK_READ_SIZE = 1024 * 1024


class UploadResult(TypedDict):
    url: str
    filename: str
    size: int


class MultipartSession(TypedDict):
    upload_id: str
    key: str


def _safe_extension(filename: str) -> str:
    ext = Path(filename or "").suffix.lower()
    return ext if ext in ALLOWED_EXTENSIONS else ""


def _guess_content_type(name: str) -> str:
    return mimetypes.guess_type(name)[0] or "application/octet-stream"


def blob_configured() -> bool:
    return bool(os.environ.get("BLOB_READ_WRITE_TOKEN"))


# ---------------------------------------------------------------- pedido único

async def save_upload(file: UploadFile, *, base_url: str) -> UploadResult:
    ext = _safe_extension(file.filename or "")
    if not ext:
        raise ValueError(
            "Tipo de ficheiro não suportado. Use imagem (jpg, png, webp, gif) ou vídeo (mp4, webm, mov)."
        )

    name = f"{uuid.uuid4().hex}{ext}"
    body = bytearray()
    while chunk := await file.read(CHUNK_READ_SIZE):
        body.extend(chunk)
        if len(body) > MAX_UPLOAD_BYTES:
            raise ValueError("Ficheiro demasiado grande (máximo 80MB).")

    if blob_configured():
        return await _blob_put(name, bytes(body))
    return _disk_save(name, bytes(body), base_url)


def _disk_save(name: str, data: bytes, base_url: str) -> UploadResult:
    (UPLOAD_DIR / name).write_bytes(data)
    return {"url": f"{base_url}/uploads/{name}", "filename": name, "size": len(data)}


async def _blob_put(name: str, data: bytes) -> UploadResult:
    from vercel.blob import AsyncBlobClient

    client = AsyncBlobClient()  # lê BLOB_READ_WRITE_TOKEN do ambiente
    blob = await client.put(
        name,
        data,
        access="public",
        content_type=_guess_content_type(name),
        add_random_suffix=False,
    )
    return {"url": blob.url, "filename": name, "size": len(data)}


# ---------------------------------------------------------------------- partes

async def multipart_start(filename: str) -> MultipartSession:
    ext = _safe_extension(filename or "")
    if not ext:
        raise ValueError(
            "Tipo de ficheiro não suportado. Use imagem (jpg, png, webp, gif) ou vídeo (mp4, webm, mov)."
        )
    key = f"{uuid.uuid4().hex}{ext}"

    if blob_configured():
        from vercel.blob import create_multipart_upload_async

        upload = await create_multipart_upload_async(
            key,
            access="public",
            content_type=_guess_content_type(key),
            add_random_suffix=False,
        )
        return {"upload_id": upload.upload_id, "key": upload.key}

    # Local: não há nada para inicializar do lado do servidor de blob — o
    # ficheiro é composto em disco à medida que as partes chegam, por ordem.
    return {"upload_id": key, "key": key}


async def multipart_part(*, upload_id: str, key: str, part_number: int, chunk: bytes) -> dict:
    if blob_configured():
        from vercel.blob import upload_part_async

        part = await upload_part_async(
            key,
            chunk,
            access="public",
            upload_id=upload_id,
            key=key,
            part_number=part_number,
        )
        return {"part_number": part.part_number, "etag": part.etag}

    # Local: as partes chegam sempre por ordem (o frontend envia-as em
    # sequência, nunca em paralelo), por isso um simples append reconstrói
    # o ficheiro original.
    dest = UPLOAD_DIR / f".partial-{key}"
    with dest.open("ab") as out:
        out.write(chunk)
    if dest.stat().st_size > MAX_UPLOAD_BYTES:
        dest.unlink(missing_ok=True)
        raise ValueError("Ficheiro demasiado grande (máximo 80MB).")
    return {"part_number": part_number, "etag": None}


async def multipart_complete(
    *, upload_id: str, key: str, parts: list[dict], base_url: str
) -> UploadResult:
    if blob_configured():
        from vercel.blob import MultipartPart, complete_multipart_upload_async

        part_objs = [MultipartPart(part_number=p["part_number"], etag=p["etag"]) for p in parts]
        blob = await complete_multipart_upload_async(
            key,
            part_objs,
            access="public",
            upload_id=upload_id,
            key=key,
            content_type=_guess_content_type(key),
        )
        return {"url": blob.url, "filename": key, "size": 0}

    src = UPLOAD_DIR / f".partial-{key}"
    if not src.exists():
        raise ValueError("Upload não encontrado ou já concluído.")
    dest = UPLOAD_DIR / key
    src.rename(dest)
    return {"url": f"{base_url}/uploads/{key}", "filename": key, "size": dest.stat().st_size}
