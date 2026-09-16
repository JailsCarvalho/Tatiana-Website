import React from "react";
import { motion } from "framer-motion";

const chapters = [
  {
    n: "01",
    title: "A matéria não mente.",
    body:
      "Pinto porque o pigmento resiste. Ele exige tempo, insiste em ser visto e recusa ser resumido. Um quadro é sempre uma conversa com o que a mão não sabia ainda.",
  },
  {
    n: "02",
    title: "O gesto antes da imagem.",
    body:
      "Desenhar é escutar o corpo antes de escutar o motivo. Trabalho a partir do gesto — um traço rápido, decidido — e deixo a imagem chegar por dentro.",
  },
  {
    n: "03",
    title: "Ensinar como se apreende.",
    body:
      "Ensino em grupos pequenos, sem pressa. Cada aluno traz uma pergunta própria. O atelier é o sítio onde essa pergunta pode ser feita várias vezes.",
  },
];

export default function Manifesto() {
  return (
    <section
      data-testid="manifesto"
      className="px-6 md:px-10 py-24 md:py-40 border-t border-black"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-24">
        <p className="col-span-12 md:col-span-3 num-marker text-black/60">
          — Manifesto em três capítulos
        </p>
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
          className="col-span-12 md:col-span-9 display text-6xl md:text-8xl lg:text-9xl"
        >
          Três coisas <span className="italic">em que</span> acredito.
        </motion.h2>
      </div>

      <div className="space-y-16 md:space-y-24">
        {chapters.map((c, i) => (
          <motion.div
            key={c.n}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="grid grid-cols-12 gap-6 md:gap-10 border-t border-black pt-8"
            data-testid={`manifesto-chapter-${c.n}`}
          >
            <div className="col-span-4 md:col-span-2">
              <span className="display text-6xl md:text-8xl">{c.n}</span>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-4">
              <h3 className="display text-4xl md:text-6xl mb-6 md:mb-10">{c.title}</h3>
              <p className="max-w-lg text-base leading-relaxed text-black/75 font-sans-editorial">
                {c.body}
              </p>
            </div>
            <div className="hidden md:block col-span-3 md:col-start-10 num-marker text-black/60 pt-6">
              — Capítulo {c.n} / III
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
