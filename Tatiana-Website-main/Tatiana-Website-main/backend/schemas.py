"""Schemas Pydantic — contratos de entrada e saída da API."""

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

ORM = ConfigDict(from_attributes=True, populate_by_name=True)


# ---- Autenticação ----
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class AdminUserOut(BaseModel):
    model_config = ORM

    id: uuid.UUID
    email: EmailStr
    name: str | None = None


# ---- Contacto ----
class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: str | None = Field(default="Contacto do website", max_length=255)
    message: str = Field(min_length=1, max_length=4000)
    topic: str | None = Field(default="general", max_length=40)  # general | workshop | aula


class ContactMessageOut(BaseModel):
    model_config = ORM

    id: uuid.UUID
    name: str
    email: EmailStr
    subject: str | None = None
    message: str
    topic: str
    email_sent: bool
    created_at: datetime


# ---- Conteúdo público ----
class WorkshopOut(BaseModel):
    model_config = ORM

    id: uuid.UUID
    slug: str
    # A coluna chama-se index_label (index é palavra reservada em SQL); a API
    # mantém `index`, que é o nome que o frontend já consome.
    index: str | None = Field(
        default=None, validation_alias="index_label", serialization_alias="index"
    )
    title: str
    subtitle: str | None = None
    tagline: str | None = None
    description: str | None = None
    long_description: str | None = None
    period: str | None = None
    cadence: str | None = None
    schedule: list[str] = []
    ages: str | None = None
    seats: int | None = None
    price: str | None = None
    price_note: str | None = None
    location: str | None = None
    requirements: str | None = None
    cta: str | None = None
    status: str | None = None


class AulaOut(BaseModel):
    model_config = ORM

    id: uuid.UUID
    slug: str
    number: str | None = None
    title: str
    level: str | None = None
    question: str | None = None
    summary: str | None = None
    description: str | None = None
    videos: list[str] = []


class BlogPostOut(BaseModel):
    model_config = ORM

    id: uuid.UUID
    slug: str
    title: str
    excerpt: str | None = None
    content_md: str | None = None
    cover_image_url: str | None = None
    published_at: datetime | None = None
    # Chaves que a página de blog já usa na listagem editorial
    number: str | None = None
    date: str | None = None
    read: str | None = None
