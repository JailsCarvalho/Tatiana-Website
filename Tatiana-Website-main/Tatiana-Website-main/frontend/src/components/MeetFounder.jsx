import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PORTRAIT =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/d76iq2d1_WhatsApp%20Image%202026-07-20%20at%2020.45.07.jpeg";

export default function MeetFounder() {
  return (
    <section
      data-testid="meet-founder"
      className="border-t border-black px-6 md:px-10 py-24 md:py-40"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-16 items-start">
        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="col-span-12 md:col-span-5 spotlight overflow-hidden border border-black"
        >
          <img
            src={PORTRAIT}
            alt="Tatiana Santos"
            className="w-full h-[60vh] md:h-[80vh] object-cover"
          />
        </motion.div>

        {/* Text */}
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <p className="num-marker text-black/60 mb-6">— Quem ensina</p>
          <motion.h2
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="display text-5xl md:text-7xl lg:text-8xl mb-8"
          >
            Tatiana <span className="italic">Santos</span>
          </motion.h2>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-2xl md:text-3xl leading-snug text-black/85 mb-6"
          >
            Pintora e fotógrafa. Fundou a Galeria-Atelier Ícone em 2008 para
            reunir num só sítio o que sempre precisou: <em className="italic">tempo</em>,
            {" "}<em className="italic">material</em> e outras pessoas a trabalhar ao lado.
          </motion.p>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-base md:text-lg leading-relaxed text-black/70 max-w-xl"
          >
            Licenciada em Pintura pela Escola Universitária das Artes de Coimbra
            (2006). Expõe regularmente em Portugal e no estrangeiro desde 2005 e
            recebeu diversos prémios em Pintura e Fotografia.
          </motion.p>

          <Link
            to="/sobre"
            data-testid="meet-founder-cta"
            className="mt-10 inline-block border border-black px-8 py-4 text-[11px] tracking-[0.3em] uppercase hover-invert"
          >
            Ler biografia completa →
          </Link>
        </div>
      </div>
    </section>
  );
}
