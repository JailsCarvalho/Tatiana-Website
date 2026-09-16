import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import VideoGallery from "@/components/VideoGallery";
import Seo from "@/components/Seo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Workshops() {
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/workshops`)
      .then((r) => setWorkshop((r.data.items || [])[0] || null));
  }, []);

  return (
    <div data-testid="page-workshops">
      <Seo
        title="Workshops de Pintura em Coimbra | Atelier Galeria Ícone"
        description="Workshops e imersões de pintura em Coimbra para adultos e crianças. Explore técnicas de pintura e desenho em grupo no Atelier Galeria Ícone."
        path="/workshops"
        keywords="Workshop de pintura em Coimbra, Aulas de pintura em Coimbra, Aulas de arte em Coimbra, Curso de pintura em Coimbra"
      />
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 px-6 md:px-10">
        <div>
          <p className="col-span-12 md:col-span-3 num-marker text-black/60">
            — Programa 2026
          </p>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="col-span-12 md:col-span-9 display text-4xl md:text-5xl lg:text-4xl"
          >
            Workshops <span className="italic">&</span> Imersões
          </motion.h1>
        </div>
      </section>

      {/* Featured workshop — single */}
      {workshop && (
        <section
          className="border-t border-black px-6 md:px-10 py-16 md:py-24"
          data-testid={`workshop-${workshop.id}`}
        >
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4 mb-8"
          >
            <span className="inline-block border border-black px-4 py-2 text-[10px] tracking-[0.3em] uppercase">
              {workshop.status}
            </span>
            <span className="num-marker text-black/60">
              N.º {workshop.index} · {workshop.period}
            </span>
          </motion.div>

          <div className="grid grid-cols-12 gap-6 md:gap-16">
            {/* Title + description */}
            <div className="col-span-12 md:col-span-7">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                className="display text-5xl md:text-7xl lg:text-8xl leading-[0.9]"
              >
                {workshop.title}
              </motion.h2>
              <p className="mt-4 num-marker text-black/60">{workshop.subtitle}</p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.1 }}
                className="mt-12 font-serif text-2xl md:text-3xl leading-snug italic text-black/85 max-w-2xl"
              >
                {workshop.tagline}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 }}
                className="mt-8 font-serif text-xl md:text-2xl leading-snug text-black/85 max-w-2xl"
              >
                {workshop.description}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="mt-6 text-base md:text-lg leading-relaxed text-black/70 max-w-xl"
              >
                {workshop.long_description}
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.25 }}
                className="mt-8 num-marker text-black/60"
              >
                — {workshop.requirements}
              </motion.p>

              <motion.a
                href="#contacto"
                data-testid="workshop-cta"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.3 }}
                className="mt-10 inline-block border border-black px-8 py-4 text-[11px] tracking-[0.3em] uppercase hover-invert"
              >
                {workshop.cta} →
              </motion.a>
            </div>

            {/* Fact sheet */}
            <aside className="col-span-12 md:col-span-4 md:col-start-9">
              <div className="border-t border-black">
                {[
                  ["Idades", workshop.ages],
                  ["Vagas", `${workshop.seats} participantes`],
                  ["Período", workshop.period],
                  ["Frequência", workshop.cadence],
                  ["Local", workshop.location],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-12 gap-3 border-b border-black py-4 items-baseline"
                  >
                    <span className="col-span-4 num-marker text-black/60">— {label}</span>
                    <span className="col-span-8 font-serif text-xl md:text-2xl leading-tight">
                      {value}
                    </span>
                  </div>
                ))}

                <div className="py-6 border-b border-black">
                  <p className="num-marker text-black/60 mb-3">— Horário (à escolha)</p>
                  <ul className="space-y-2">
                    {(workshop.schedule || []).map((s) => (
                      <li key={s} className="font-serif text-xl md:text-2xl">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* Video gallery */}
      <VideoGallery />

      {/* Contact / bookings pointer */}
      <section className="border-t border-black px-6 md:px-10 py-24 md:py-40">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-5">
            <p className="num-marker text-black/60 mb-4">— Inscrições</p>
            <h2 className="display text-5xl md:text-7xl">
              Reservar <span className="italic">lugar</span>.
            </h2>
            <p className="max-w-md mt-6 text-sm leading-relaxed text-black/70">
              Escreva-nos com o nome do participante e a semana pretendida.
              Confirmamos a inscrição em 48h.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7 flex flex-col gap-6">
            <a
              href="mailto:galeriaicone@gmail.com?subject=Inscri%C3%A7%C3%A3o%20Workshop%20F%C3%A9rias%20de%20Ver%C3%A3o"
              className="border border-black px-8 py-6 text-[11px] tracking-[0.3em] uppercase hover-invert flex items-baseline justify-between gap-4"
              data-testid="workshop-book-email"
            >
              <span>Escrever email</span>
              <span className="font-serif italic text-base normal-case tracking-normal">galeriaicone@gmail.com</span>
            </a>
            <a
              href="tel:+351967311015"
              className="border border-black px-8 py-6 text-[11px] tracking-[0.3em] uppercase hover-invert flex items-baseline justify-between gap-4"
              data-testid="workshop-book-phone"
            >
              <span>Telefonar</span>
              <span className="font-serif italic text-base normal-case tracking-normal">+351 967 311 015</span>
            </a>
            <Link
              to="/sobre"
              className="link-underline text-[11px] tracking-[0.3em] uppercase pt-2"
            >
              Conhecer quem ensina →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
