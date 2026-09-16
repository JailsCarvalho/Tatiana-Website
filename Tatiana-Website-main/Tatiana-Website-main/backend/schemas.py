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


# ---- Painel: Workshops ----
class WorkshopIn(BaseModel):
    """Corpo de criação/edição. `slug` é opcional — gerado do título se omitido."""

    slug: str | None = Field(default=None, max_length=200)
    index_label: str | None = Field(default=None, max_length=10)
    title: str = Field(min_length=1, max_length=250)
    subtitle: str | None = Field(default=None, max_length=250)
    tagline: str | None = None
    description: str | None = None
    long_description: str | None = None
    period: str | None = Field(default=None, max_length=250)
    cadence: str | None = Field(default=None, max_length=250)
    schedule: list[str] = []
    ages: str | None = Field(default=None, max_length=120)
    seats: int | None = Field(default=None, ge=0)
    price: str | None = Field(default=None, max_length=80)
    price_note: str | None = None
    location: str | None = Field(default=None, max_length=250)
    requirements: str | None = None
    cta: str | None = Field(default=None, max_length=120)
    status: str | None = Field(default=None, max_length=80)
    sort_order: int = 0
    published: bool = True


class WorkshopAdminOut(BaseModel):
    model_config = ORM

    id: uuid.UUID
    slug: str
    index_label: str | None = None
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
    sort_order: int
    published: bool
    created_at: datetime
    updated_at: datetime


# ---- Painel: Blog ----
class BlogPostIn(BaseModel):
    slug: str | None = Field(default=None, max_length=200)
    title: str = Field(min_length=1, max_length=250)
    excerpt: str | None = Field(default=None, max_length=500)
    content_md: str = ""
    cover_image_url: str | None = None
    read_time: str | None = Field(default=None, max_length=40)
    published: bool = False


class BlogPostAdminOut(BaseModel):
    model_config = ORM

    id: uuid.UUID
    slug: str
    title: str
    excerpt: str | None = None
    content_md: str
    cover_image_url: str | None = None
    read_time: str | None = None
    published: bool
    published_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


# ---- Painel: Aulas ----
class AulaIn(BaseModel):
    slug: str | None = Field(default=None, max_length=200)
    number: str | None = Field(default=None, max_length=10)
    title: str = Field(min_length=1, max_length=250)
    level: str | None = Field(default=None, max_length=120)
    question: str | None = None
    summary: str | None = None
    description: str | None = None
    videos: list[str] = []
    sort_order: int = 0
    published: bool = True


class AulaAdminOut(BaseModel):
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
    sort_order: int
    published: bool
    created_at: datetime
    updated_at: datetime


# ---- Painel: Upload ----
class UploadOut(BaseModel):
    url: str
    filename: str
    size: int
