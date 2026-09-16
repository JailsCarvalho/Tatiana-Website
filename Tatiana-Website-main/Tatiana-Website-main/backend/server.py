"""Entrada da aplicação FastAPI — Atelier Galeria Ícone."""

import logging
import os
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI
from starlette.middleware.cors import CORSMiddleware

from database import engine
from routers import admin_blog, admin_workshops, auth, contact, content

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    await engine.dispose()


app = FastAPI(title="Atelier Galeria Ícone API", lifespan=lifespan)

api_router = APIRouter(prefix="/api")


@api_router.get("/")
async def root():
    return {"message": "Atelier Galeria Ícone API — em movimento."}


api_router.include_router(auth.router)
api_router.include_router(contact.router)
api_router.include_router(content.router)
api_router.include_router(admin_workshops.router)
api_router.include_router(admin_blog.router)
app.include_router(api_router)

# Com autenticação por cookie, a origem tem de ser explícita: o browser recusa
# `allow_origins=["*"]` em conjunto com credenciais.
_raw_origins = os.environ.get("CORS_ORIGINS", "http://localhost:3000")
_origins = [origin.strip() for origin in _raw_origins.split(",") if origin.strip()]
_allow_credentials = "*" not in _origins
if not _allow_credentials:
    logger.warning("CORS_ORIGINS='*' — cookies de sessão não funcionarão entre origens.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)
