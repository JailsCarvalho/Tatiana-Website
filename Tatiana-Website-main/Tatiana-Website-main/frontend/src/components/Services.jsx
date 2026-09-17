import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const services = [
  {
    n: "01",
    title: "Aulas contínuas",
    subtitle: "Todo o ano · turmas pequenas",
    text:
      "Aulas semanais e quinzenais de desenho, pintura em óleo, aquarela e retrato. Um ritmo próprio, acompanhamento individual e uma prática que dura para lá do curso.",
    to: "/aulas",
    cta: "Ver aulas",
    for: "Para jovens e adultos, todos os níveis.",
  },
  {
    n: "02",
    title: "Workshops & imersões",
    subtitle: "Programa 2026 · em datas curtas",
    text:
      "Fins-de-semana e imersões de vários dias, em torno de um tema. Do gesto ao retrato, do carvão à cor, para quem quer aprofundar em pouco tempo.",
    to: "/workshops",
    cta: "Ver workshops",
    for: "Para quem quer mergulhar num tema específico.",
  },
  {
    n: "03",
    title: "Atelier livre",
    subtitle: "Sessões de modelo & prática livre",
    text:
      "Sessões abertas onde artistas e alunos usam o espaço, o material e o modelo vivo. Sem professor a dirigir — apenas tempo, luz e outros que também pintam.",
    to: "/aulas",
    cta: "Marcar visita",
    for: "Para artistas em prática regular.",
  },
  {
    n: "04",
    title: "Preparação de portefólio",
    subtitle: "Mentoria individual",
    text:
      "Acompanhamento personalizado para candidaturas a Belas-Artes, escolas artísticas ou exposições. Reuniões marcadas, revisão de trabalho e plano próprio.",
    to: "/aulas",
    cta: "Falar connosco",
    for: "Para candidatos e artistas em início de percurso.",
  },
];

export default function Services() {
  return (
    <section
      id="servicos"
      data-testid="services"
      className="border-t border-black px-6 md:px-10 py-24 md:py-40"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-24">
        <p className="col-span-12 md:col-span-3 num-marker text-black/60">
          — Como funciona o atelier
        </p>
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="col-span-12 md:col-span-9 font-serif text-2xl md:text-3xl leading-snug text-black/85"
        >
          No Galeria-Atelier Ícone, cada aluno encontra um espaço acolhedor e de
          luz natural, onde aprende ao seu ritmo e desenvolve o seu potencial
          artístico com acompanhamento personalizado. As aulas frequentam-se
          uma ou mais vezes por semana, consoante a disponibilidade de cada
          um — material incluído no valor mensal.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 border-t border-black">
        {services.map((s, i) => (
          <motion.article
            key={s.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.06, ease: [0.19, 1, 0.22, 1] }}
            data-testid={`service-${s.n}`}
            className={`p-8 md:p-12 border-b border-black ${
              i % 2 === 0 ? "md:border-r md:border-black" : ""
            } group`}
          >
            <div className="flex items-baseline justify-between mb-6">
              <span className="display text-4xl md:text-6xl">{s.n}</span>
              <span className="num-marker text-black/50 text-right">
                {s.subtitle}
              </span>
            </div>
            <h3 className="display text-4xl md:text-5xl lg:text-6xl leading-none mb-6 group-hover:italic transition-all duration-500">
              {s.title}
            </h3>
            <p className="font-serif text-lg md:text-xl leading-snug text-black/80 max-w-xl">
              {s.text}
            </p>
            <p className="mt-6 num-marker text-black/60">— {s.for}</p>
            <Link
              to={s.to}
              className="mt-8 inline-block border border-black px-6 py-3 text-[10px] tracking-[0.3em] uppercase hover-invert"
              data-testid={`service-cta-${s.n}`}
            >
              {s.cta} →
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
