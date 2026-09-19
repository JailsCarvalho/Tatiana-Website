import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";

const easeOut = [0.19, 1, 0.22, 1];

function MaskLine({ children, delay = 0 }) {
  return (
    <span className="line-mask">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.1, ease: easeOut, delay }}
        style={{ display: "inline-block" }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const bio = [
  "Tatiana Santos nasceu em Leiria, Portugal, em 1978, e reside em Coimbra. Licenciada em Pintura pela Escola Universitária das Artes de Coimbra desde 2006, expõe regularmente em Portugal e no estrangeiro desde 2005, tendo recebido diversos prémios tanto em Pintura assim como em Fotografia.",
  "Em 2008 fundou a Galeria-Atelier Ícone, onde desenvolve trabalho artístico e pedagógico, promovendo exposições e eventos culturais. Participou também na produção e curadoria de vários festivais e iniciativas artísticas.",
];

export default function Sobre() {
  useEffect(() => {
    document.documentElement.classList.add("js-ready");
  }, []);

  return (
    <div data-testid="page-sobre">
      <Seo
        title="Sobre · Tatiana Santos | Atelier de Pintura em Coimbra"
        description="Conheça Tatiana Santos, pintora e fundadora do Atelier Galeria Ícone em Coimbra — um espaço de aulas de pintura e desenho para todos os níveis."
        path="/sobre"
        keywords="Atelier de pintura em Coimbra, Atelier de desenho em Coimbra, Escola de pintura em Coimbra, Tatiana Santos pintora"
      />
      <section className="pt-28 md:pt-36 pb-16 px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-4">
            <p className="num-marker text-black/60 mb-6">— A artista</p>
            <h1 className="display text-6xl md:text-8xl lg:text-9xl">
              <MaskLine delay={0.15}>Tatiana</MaskLine>
              <MaskLine delay={0.35}><span className="italic">Santos</span></MaskLine>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeOut, delay: 0.9 }}
              className="mt-8 max-w-sm text-sm leading-relaxed text-black/70"
            >
              Pintora, fotógrafa e fundadora da Galeria-Atelier Ícone (Coimbra, 2008).
            </motion.p>
          </div>

          <div className="col-span-12 md:col-span-8">
            <motion.div
              initial={{ opacity: 0, scale: 1.15 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: easeOut }}
              className="spotlight overflow-hidden border border-black"
            >
              <img
                src="https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/d76iq2d1_WhatsApp%20Image%202026-07-20%20at%2020.45.07.jpeg"
                alt="Retrato de Tatiana Santos no atelier"
                className="w-full h-[60vh] md:h-[80vh] object-cover"
              />
            </motion.div>
            <div className="mt-4 flex items-baseline justify-between num-marker text-black/60">
              <span>Retrato · Atelier · Coimbra</span>
              <span>Fotografia: arquivo Galeria-Atelier Ícone</span>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="border-t border-black px-6 md:px-10 py-24 md:py-40">
        <div className="grid grid-cols-12 gap-6 md:gap-16">
          <div className="col-span-12 md:col-span-3">
            <div className="md:sticky md:top-24">
              <p className="num-marker text-black/60">— Biografia</p>
              <h2 className="font-serif text-4xl md:text-5xl mt-4 leading-none">
                Notas <span className="italic">breves</span>
              </h2>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-5 space-y-10">
            {bio.map((p, i) => (
              <motion.p
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                className="font-serif text-2xl md:text-3xl leading-snug"
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-black px-6 md:px-10 py-24 md:py-40">
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-12">
          <p className="col-span-12 md:col-span-3 num-marker text-black/60">— Percurso</p>
          <h2 className="col-span-12 md:col-span-9 display text-5xl md:text-7xl">
            Alguns <span className="italic">marcos</span>.
          </h2>
        </div>
        <div className="space-y-0 border-t border-black">
          {[
            ["1978", "Nasce em Leiria, Portugal"],
            ["2005", "Início das exposições regulares em Portugal e no estrangeiro"],
            ["2006", "Licenciatura em Pintura — Escola Universitária das Artes de Coimbra"],
            ["2008", "Fundação da Galeria-Atelier Ícone, em Coimbra"],
            ["—", "Prémios em Pintura e Fotografia"],
            ["hoje", "Produção artística, curadoria e ensino no atelier"],
          ].map(([y, t]) => (
            <div
              key={y}
              className="grid grid-cols-12 gap-6 md:gap-10 border-b border-black py-6 md:py-8 items-baseline"
            >
              <span className="col-span-3 md:col-span-2 display text-4xl md:text-6xl">{y}</span>
              <span className="col-span-9 md:col-span-10 font-serif text-2xl md:text-3xl">{t}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
