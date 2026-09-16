import React from "react";
import { motion } from "framer-motion";

const materials = [
  "Carvão & Grafite",
  "Pintura acrílica",
  "Pintura a óleo",
  "Aguarela",
  "Lápis de cor",
  "Pastel de óleo",
  "Técnicas mistas",
  "Tinta da China",
  "Canetas Copic",
  "Canetas acrílicas",
];

const materialBenefits = [
  "🖌️ Diferentes técnicas",
  "🎨 Materiais de excelência",
  "✏️ Uma enorme variedade de suportes e ferramentas",
  "✨ Liberdade para experimentar e encontrar a sua própria linguagem artística",
];

export default function Materials() {
  return (
    <section
      data-testid="materials"
      className="border-t border-black px-6 md:px-10 py-24 md:py-40"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-20">
        <p className="col-span-12 md:col-span-3 num-marker text-black/60">
          — Materiais & técnicas
        </p>
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="col-span-12 md:col-span-9 display text-4xl md:text-6xl lg:text-7xl"
          data-testid="materials-title"
        >
          UM MUNDO DE MATERIAIS<br />
          À TUA DISPOSIÇÃO
        </motion.h2>
      </div>

      <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
        <div className="col-span-12 md:col-span-3">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-lg md:text-xl leading-snug text-black/80 max-w-xs"
            data-testid="materials-introduction"
          >
            No Atelier, acreditamos que experimentar diferentes materiais é também
            uma forma de descobrir novas possibilidades criativas.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08 }}
            className="mt-6 font-serif text-base md:text-lg leading-snug text-black/80 max-w-xs"
            data-testid="materials-description"
          >
            Por isso, temos à disposição uma grande diversidade de materiais de
            desenho e pintura, cuidadosamente selecionados e de marcas de elevada
            qualidade, para que cada aluno possa explorar, experimentar e
            desenvolver o seu trabalho ao máximo.
          </motion.p>
          <ul className="mt-8 space-y-3 text-sm leading-relaxed" data-testid="materials-benefits">
            {materialBenefits.map((benefit, index) => (
              <li key={benefit} data-testid={`materials-benefit-${index + 1}`}>
                {benefit}
              </li>
            ))}
          </ul>
          <p
            className="mt-8 font-serif text-base md:text-lg leading-snug text-black/80 max-w-xs"
            data-testid="materials-closing"
          >
            Porque quando temos os materiais certos à nossa disposição, a
            criatividade não tem limites.
          </p>
        </div>

        <div className="col-span-12 md:col-span-9">
          <ul className="border-t border-black" data-testid="materials-list">
            {materials.map((m, i) => (
              <motion.li
                key={m}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.7, delay: i * 0.04, ease: [0.19, 1, 0.22, 1] }}
                className="grid grid-cols-12 gap-4 md:gap-10 items-baseline border-b border-black py-5 md:py-6 group cursor-default"
                data-testid={`material-${i + 1}`}
              >
                <span className="col-span-2 md:col-span-1 num-marker text-black/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-10 md:col-span-9 font-serif text-3xl md:text-5xl leading-none group-hover:italic transition-all duration-500">
                  {m}
                </span>
                <span className="hidden md:block col-span-2 num-marker text-black/40 text-right">
                  incluído
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
