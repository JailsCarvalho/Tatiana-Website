import React from "react";
import { motion } from "framer-motion";

const IMAGES = {
  students:
    "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/qbw1ufp0_27.jpeg",
  drawings:
    "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/e9d9zyfc_25.jpeg",
  interior:
    "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/0i1mmivk_20.jpeg",
  materials:
    "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/q50ubcj4_26.jpeg",
};

export default function AtelierSpace() {
  return (
    <section
      data-testid="atelier-space"
      className="border-t border-black px-6 md:px-10 py-24 md:py-40"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-24">
        <p className="col-span-12 md:col-span-3 num-marker text-black/60">— O espaço</p>
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="col-span-12 md:col-span-9 display text-5xl md:text-7xl lg:text-8xl"
        >
          Um <span className="italic">lugar</span> físico<br />
          feito para <span className="italic">trabalhar</span>.
        </motion.h2>
      </div>

      {/* Editorial asymmetrical photo grid */}
      <div className="grid grid-cols-12 gap-6 md:gap-10">
        {/* Big photo: interior */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
          className="col-span-12 md:col-span-8 spotlight overflow-hidden border border-black"
        >
          <img
            src={IMAGES.interior}
            alt="Interior do atelier"
            className="w-full h-[70vh] object-cover"
          />
        </motion.div>

        {/* Side text + small photo */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6 md:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="pt-0 md:pt-6"
          >
            <p className="num-marker text-black/60 mb-4">— Coimbra, centro</p>
            <p className="font-serif text-xl md:text-2xl leading-snug text-black/85">
              Um edifício antigo, tectos altos, luz natural do norte. Cavaletes,
              mesas de trabalho, materiais partilhados, uma pequena biblioteca de
              referência. Um espaço pensado para quem vem para ficar.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15 }}
            className="spotlight overflow-hidden border border-black"
          >
            <img
              src={IMAGES.materials}
              alt="Materiais e cavaletes"
              className="w-full h-[42vh] object-cover"
            />
          </motion.div>
        </div>

        {/* Two side-by-side smaller frames */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, delay: 0.05 }}
          className="col-span-12 md:col-span-7 spotlight overflow-hidden border border-black"
        >
          <img
            src={IMAGES.students}
            alt="Alunos a trabalhar no atelier"
            className="w-full h-[55vh] object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="col-span-12 md:col-span-5 spotlight overflow-hidden border border-black"
        >
          <img
            src={IMAGES.drawings}
            alt="Desenhos de retrato a carvão"
            className="w-full h-[55vh] object-cover"
          />
        </motion.div>
      </div>

      {/* Numbered detail row */}
      <div className="mt-16 md:mt-24 grid grid-cols-12 gap-6 md:gap-10 border-t border-black pt-10">
        {[
          ["01", "Cavaletes profissionais", "Postos de trabalho fixos para cada aluno."],
          ["02", "Material partilhado", "Aguarelas, pastéis, óleo, carvão — tudo à mão."],
          ["03", "Turmas pequenas", "Nunca mais de 8 pessoas por sessão."],
          ["04", "Modelo vivo", "Sessões regulares com modelo em pose."],
        ].map(([n, t, d], i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.05 }}
            className="col-span-6 md:col-span-3"
          >
            <p className="display text-3xl md:text-4xl mb-2">{n}</p>
            <p className="font-serif text-lg md:text-xl leading-tight">{t}</p>
            <p className="mt-2 text-sm text-black/60 leading-relaxed">{d}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
