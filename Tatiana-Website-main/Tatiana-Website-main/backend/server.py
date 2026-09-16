from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import httpx
import ipaddress
import re
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from urllib.parse import urlparse
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent Email (Resend proxy) - constant base URL is intentional
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ["EMERGENT_EMAIL_KEY"]
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
GALLERY_OWNER_EMAIL = os.environ["GALLERY_OWNER_EMAIL"]

app = FastAPI(title="Atelier Galeria Ícone API")
api_router = APIRouter(prefix="/api")


# ---- Models ----
class ContactMessageCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    subject: Optional[str] = Field(default="Contacto do website")
    message: str = Field(min_length=1, max_length=4000)
    topic: Optional[str] = Field(default="general")  # general | workshop | aula


class ContactMessage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: Optional[str] = None
    message: str
    topic: Optional[str] = "general"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    email_sent: bool = False


# ---- Routes ----
@api_router.get("/")
async def root():
    return {"message": "Atelier Galeria Ícone API — em movimento."}


def build_email_html(payload: ContactMessageCreate) -> str:
    safe_name = escape(payload.name)
    safe_email = escape(str(payload.email))
    safe_subject = escape(payload.subject or "Contacto do website")
    safe_topic = escape(payload.topic or "general")
    safe_msg = escape(payload.message or "").replace("\n", "<br>")
    return f"""
    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Georgia, 'Times New Roman', serif; background:#ffffff; color:#000000;">
      <tr><td style="padding: 32px 24px; border-bottom: 1px solid #000;">
        <p style="letter-spacing:0.3em; font-size:11px; text-transform:uppercase; margin:0;">Atelier Galeria Ícone — Novo contacto</p>
        <h1 style="font-size:28px; margin:16px 0 0; font-weight:400;">{safe_subject}</h1>
      </td></tr>
      <tr><td style="padding: 24px;">
        <p style="margin:0 0 8px;"><strong>Nome:</strong> {safe_name}</p>
        <p style="margin:0 0 8px;"><strong>Email:</strong> {safe_email}</p>
        <p style="margin:0 0 8px;"><strong>Tópico:</strong> {safe_topic}</p>
        <hr style="border:none; border-top:1px solid #000; margin:16px 0;">
        <p style="margin:0; line-height:1.7; font-family: Georgia, serif; font-size:15px;">{safe_msg}</p>
      </td></tr>
      <tr><td style="padding: 20px 24px; border-top:1px solid #000;">
        <p style="margin:0; font-size:11px; letter-spacing:0.2em; text-transform:uppercase;">Mensagem recebida através do website da Galeria-Atelier Ícone</p>
      </td></tr>
    </table>
    """


_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = (
    "reply with your password", "reply with the code", "send your password", "cvv",
    "send us your password", "enter your password below", "confirm your card number",
    "your full card number", "seed phrase", "recovery phrase", "verify your card",
    "social security number", "confirm your bank details",
)
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == item or host.endswith("." + item) for item in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [value for key, value in attrs if key.lower() in ("href", "src") and value]
        if tag.lower() == "a":
            self._href = dict((key.lower(), value) for key, value in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email")
    body = f"{subject}\n{html}".lower()
    for phrase in _CRED_ASK:
        if phrase in body:
            raise ValueError("Email asks the recipient for credentials")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError("Email links and assets must use absolute https URLs")
        parsed = urlparse(low)
        host = parsed.hostname or ""
        if not _host_ok(host) or parsed.username is not None:
            raise ValueError("Unsafe email URL")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for match in _HOSTISH.finditer(text):
            if not _same_site(match.group(1).lower(), real):
                raise ValueError("Email link text does not match its destination")


async def send_email_via_emergent(to_email: str, subject: str, html: str, reply_to: Optional[str] = None) -> Optional[str]:
    _assert_safe_email(subject, html)
    payload = {
        "to": [to_email],
        "subject": subject,
        "html": html,
        "from_name": EMAIL_FROM_NAME,
    }
    if reply_to:
        payload["contact_email"] = reply_to
    async with httpx.AsyncClient(timeout=30) as http:
        resp = await http.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    try:
        return resp.json().get("id")
    except Exception:
        return None


@api_router.post("/contact", response_model=ContactMessage)
async def create_contact(payload: ContactMessageCreate):
    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email,
        subject=(payload.subject or "Contacto do website").strip(),
        message=payload.message.strip(),
        topic=payload.topic or "general",
    )

    # Send email to gallery owner (non-blocking failure)
    try:
        subject_line = "[Atelier Galeria Ícone] Novo contacto do website"
        email_id = await send_email_via_emergent(
            to_email=GALLERY_OWNER_EMAIL,
            subject=subject_line,
            html=build_email_html(payload),
            reply_to=str(msg.email),
        )
        msg.email_sent = bool(email_id)
    except httpx.HTTPStatusError as e:
        logging.error(f"Email send failed: {e.response.status_code} {e.response.text}")
        msg.email_sent = False
    except Exception as e:
        logging.error(f"Email send error: {e}")
        msg.email_sent = False

    doc = msg.model_dump()
    doc["created_at"] = doc["created_at"].isoformat()
    await db.contact_messages.insert_one(doc)
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contacts(limit: int = 50):
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(limit)
    for d in docs:
        if isinstance(d.get("created_at"), str):
            try:
                d["created_at"] = datetime.fromisoformat(d["created_at"])
            except Exception:
                d["created_at"] = datetime.now(timezone.utc)
    return docs


# ---- Static content endpoints (workshops / aulas) ----
@api_router.get("/workshops")
async def get_workshops():
    return {
        "items": [
            {
                "id": "w-verao-2026",
                "index": "01",
                "title": "Workshop Férias de Verão",
                "subtitle": "Pintura & Desenho",
                "tagline": "Dar asas à criatividade, trabalhar a imaginação e passar o tempo juntos com qualidade.",
                "period": "Julho e Setembro 2026",
                "cadence": "Regime semanal — escolha a semana que se adapta às suas férias",
                "schedule": [
                    "Manhã · 11h00 — 13h00",
                    "Tarde · 15h00 — 17h00",
                ],
                "ages": "7 aos 18 anos",
                "seats": 10,
                "price": "70€",
                "price_note": "material incluído (excepto tela, se optar por pintura sobre tela)",
                "location": "Galeria-Atelier Ícone · Coimbra",
                "requirements": "Não é necessário qualquer conhecimento prévio em pintura ou desenho.",
                "description": (
                    "Neste workshop iremos dar asas à criatividade, trabalhar a "
                    "imaginação e passar o tempo juntos com qualidade — desenvolver "
                    "conhecimento com muita diversão."
                ),
                "long_description": (
                    "Os participantes não necessitam de ter qualquer tipo de "
                    "conhecimento ou habilidade especial na área da pintura. "
                    "Basta trazer vontade de aprender, explorar a criatividade e "
                    "viver uma experiência nova, divertida e enriquecedora."
                ),
                "cta": "Reservar lugar",
                "status": "Inscrições abertas",
            },
        ]
    }


@api_router.get("/aulas")
async def get_aulas():
    return {
        "items": [
            {
                "id": "a-01",
                "title": "Desenho Contínuo",
                "cadence": "Semanal · Terças 19h",
                "level": "Todos os níveis",
                "price": "€120 / mês",
                "description": "Um encontro semanal para construir uma prática de desenho persistente. Grupo pequeno, acompanhamento individual.",
            },
            {
                "id": "a-02",
                "title": "Pintura em Óleo",
                "cadence": "Quinzenal · Sábados 10h",
                "level": "Intermédio",
                "price": "€150 / mês",
                "description": "Estudo de matéria, camadas e transparência. Cada aluno desenvolve um projecto próprio ao longo do trimestre.",
            },
            {
                "id": "a-03",
                "title": "Retrato & Anatomia",
                "cadence": "Mensal · Domingos",
                "level": "Avançado",
                "price": "€90 / sessão",
                "description": "Sessão intensiva mensal com modelo. Anatomia observada, construção do rosto, expressão e presença.",
            },
            {
                "id": "a-04",
                "title": "Acompanhamento de Portfólio",
                "cadence": "Individual · Sob marcação",
                "level": "Profissional",
                "price": "Sob consulta",
                "description": "Mentoria personalizada para artistas em preparação de candidaturas, exposições ou galerias.",
            },
        ]
    }


@api_router.get("/blog")
async def get_blog():
    return {"items": []}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
