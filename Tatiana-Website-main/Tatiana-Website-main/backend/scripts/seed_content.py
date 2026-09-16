"""Importa para a base de dados o conteúdo que antes estava fixo no código.

O workshop vinha do antigo server.py; as aulas vinham do array `courses` do
frontend (extraído para scripts/seed_data/aulas.json).

Por omissão não toca em registos que já existam — para não apagar edições feitas
no painel. Use --force para reescrever.

    python scripts/seed_content.py [--force]
"""

import argparse
import asyncio
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import select  # noqa: E402

from database import SessionLocal, engine  # noqa: E402
from models import Aula, Workshop  # noqa: E402

SEED_DATA = Path(__file__).resolve().parent / "seed_data"

WORKSHOPS = [
    {
        "slug": "workshop-ferias-de-verao",
        "index_label": "01",
        "title": "Workshop Férias de Verão",
        "subtitle": "Pintura & Desenho",
        "tagline": (
            "Dar asas à criatividade, trabalhar a imaginação e passar o tempo "
            "juntos com qualidade."
        ),
        "period": "Julho e Setembro 2026",
        "cadence": "Regime semanal — escolha a semana que se adapta às suas férias",
        "schedule": ["Manhã · 11h00 — 13h00", "Tarde · 15h00 — 17h00"],
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
        "sort_order": 1,
        "published": True,
    },
]


def load_aulas() -> list[dict]:
    raw = json.loads((SEED_DATA / "aulas.json").read_text(encoding="utf-8"))
    return [
        {
            "slug": course["id"],
            "number": course.get("number"),
            "title": course["title"],
            "level": course.get("level"),
            "question": course.get("question"),
            "summary": course.get("summary"),
            "description": course.get("description"),
            "videos": course.get("videos", []),
            "sort_order": index,
            "published": True,
        }
        for index, course in enumerate(raw, start=1)
    ]


async def seed_table(session, model, rows: list[dict], force: bool) -> tuple[int, int]:
    created = updated = 0
    for row in rows:
        existing = await session.scalar(select(model).where(model.slug == row["slug"]))
        if existing is None:
            session.add(model(**row))
            created += 1
        elif force:
            for key, value in row.items():
                setattr(existing, key, value)
            updated += 1
    return created, updated


async def main() -> None:
    parser = argparse.ArgumentParser(description="Semeia workshops e aulas.")
    parser.add_argument(
        "--force", action="store_true", help="reescreve registos existentes (perde edições)"
    )
    args = parser.parse_args()

    aulas = load_aulas()
    try:
        async with SessionLocal() as session:
            w_created, w_updated = await seed_table(session, Workshop, WORKSHOPS, args.force)
            a_created, a_updated = await seed_table(session, Aula, aulas, args.force)
            await session.commit()
    finally:
        await engine.dispose()

    print(f"Workshops: {w_created} criados, {w_updated} actualizados, de {len(WORKSHOPS)}")
    print(f"Aulas:     {a_created} criadas, {a_updated} actualizadas, de {len(aulas)}")
    if not args.force and (w_created + a_created) < (len(WORKSHOPS) + len(aulas)):
        print("Registos já existentes foram deixados como estavam (use --force para reescrever).")


if __name__ == "__main__":
    asyncio.run(main())
