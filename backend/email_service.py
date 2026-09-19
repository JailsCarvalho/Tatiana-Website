"""Envio do email de notificação de contacto + validações de segurança do HTML.

A lógica de `_assert_safe_email` existia já no server.py e é mantida tal e qual:
impede que o email gerado peça credenciais, use formulários ou aponte para
destinos que não correspondem ao texto do link.
"""

import ipaddress
import os
import re
from html import escape
from html.parser import HTMLParser
from typing import Optional
from urllib.parse import urlparse

import httpx

from schemas import ContactMessageCreate

# Emergent Email (Resend proxy) - constant base URL is intentional
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY", "")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "Atelier Galeria Ícone")
GALLERY_OWNER_EMAIL = os.environ.get("GALLERY_OWNER_EMAIL", "")


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


async def send_email_via_emergent(
    to_email: str, subject: str, html: str, reply_to: Optional[str] = None
) -> Optional[str]:
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
