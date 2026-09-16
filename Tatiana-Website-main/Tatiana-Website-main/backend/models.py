"""Modelos SQLAlchemy — tabelas do site e do painel de administração."""

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, Text, Uuid, func, true
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )


class AdminUser(TimestampMixin, Base):
    """Quem pode entrar no painel. Criado por script, não há registo público."""

    __tablename__ = "admin_users"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    name: Mapped[str | None] = mapped_column(String(120))
    is_active: Mapped[bool] = mapped_column(Boolean, server_default=true(), nullable=False)


class ContactMessage(TimestampMixin, Base):
    """Mensagens do formulário de contacto do site."""

    __tablename__ = "contact_messages"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text, nullable=False)
    topic: Mapped[str] = mapped_column(String(40), server_default="general", nullable=False)
    email_sent: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)


class BlogPost(TimestampMixin, Base):
    """Artigos do Diário de Bordo. `content_md` é Markdown."""

    __tablename__ = "blog_posts"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    excerpt: Mapped[str | None] = mapped_column(Text)
    content_md: Mapped[str] = mapped_column(Text, server_default="", nullable=False)
    cover_image_url: Mapped[str | None] = mapped_column(Text)
    read_time: Mapped[str | None] = mapped_column(String(40))
    published: Mapped[bool] = mapped_column(Boolean, server_default="false", nullable=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class Workshop(TimestampMixin, Base):
    """Workshops e imersões. Substitui o conteúdo antes fixo no server.py."""

    __tablename__ = "workshops"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    index_label: Mapped[str | None] = mapped_column(String(10))
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(String(250))
    tagline: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    long_description: Mapped[str | None] = mapped_column(Text)
    period: Mapped[str | None] = mapped_column(String(250))
    cadence: Mapped[str | None] = mapped_column(String(250))
    schedule: Mapped[list] = mapped_column(JSONB, server_default="[]", nullable=False)
    ages: Mapped[str | None] = mapped_column(String(120))
    seats: Mapped[int | None] = mapped_column(Integer)
    price: Mapped[str | None] = mapped_column(String(80))
    price_note: Mapped[str | None] = mapped_column(Text)
    location: Mapped[str | None] = mapped_column(String(250))
    requirements: Mapped[str | None] = mapped_column(Text)
    cta: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str | None] = mapped_column(String(80))
    sort_order: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    published: Mapped[bool] = mapped_column(Boolean, server_default="true", nullable=False)


class Aula(TimestampMixin, Base):
    """Técnicas da página Aulas. `videos` é a lista de URLs da galeria."""

    __tablename__ = "aulas"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    number: Mapped[str | None] = mapped_column(String(10))
    title: Mapped[str] = mapped_column(String(250), nullable=False)
    level: Mapped[str | None] = mapped_column(String(120))
    question: Mapped[str | None] = mapped_column(Text)
    summary: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    videos: Mapped[list] = mapped_column(JSONB, server_default="[]", nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    published: Mapped[bool] = mapped_column(Boolean, server_default="true", nullable=False)
