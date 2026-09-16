import React from "react";
import { motion } from "framer-motion";

const works = [
  {
    idx: "N.º 001",
    title: "Corpo suspenso",
    year: "2024 · Óleo sobre linho",
    size: "180 × 130 cm",
    url: "https://images.pexels.com/photos/16397789/pexels-photo-16397789.jpeg",
    span: "md:col-span-7 md:row-span-2",
    height: "h-[70vh]",
  },
  {
    idx: "N.º 002",
    title: "Interior claro",
    year: "2024 · Aguarela",
    size: "60 × 45 cm",
    url: "https://images.pexels.com/photos/11429042/pexels-photo-11429042.jpeg",
    span: "md:col-span-5",
    height: "h-[46vh]",
  },
  {
    idx: "N.º 003",
    title: "Estudo · sombra breve",
    year: "2023 · Carvão",
    size: "42 × 30 cm",
    url: "https://images.pexels.com/photos/2218452/pexels-photo-2218452.jpeg",
    span: "md:col-span-5",
    height: "h-[40vh]",
  },
  {
    idx: "N.º 004",
    title: "Volume em repouso",
    year: "2025 · Escultura",
    size: "gesso · 45 cm",
    url: "https://images.pexels.com/photos/34331403/pexels-photo-34331403.jpeg",
    span: "md:col-span-12",
    height: "h-[80vh]",
  },
];

export default function FeaturedWorks() {
  return (
    <section
      data-testid="featured-works"
      className="px-6 md:px-10 py-24 md:py-40"
    >
      <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16">
        <div className="col-span-12 md:col-span-4">
          <p className="num-marker text-black/60">— Selecção 2023 / 2025</p>
        </div>
        <div className="col-span-12 md:col-span-8">
          <motion.h2
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="display text-6xl md:text-8xl lg:text-9xl"
          >
            Obras <span className="italic">recentes</span>
          </motion.h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
        {works.map((w, i) => (
          <motion.article
            key={w.idx}
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
            className={`spotlight overflow-hidden ${w.span}`}
            data-testid={`work-${w.idx}`}
          >
            <div className={`overflow-hidden border border-black ${w.height}`}>
              <img src={w.url} alt={w.title} className="w-full h-full object-cover" />
            </div>
            <div className="mt-4 flex items-baseline justify-between border-b border-black pb-3">
              <div>
                <p className="num-marker text-black/60">{w.idx}</p>
                <h3 className="font-serif text-3xl md:text-4xl mt-2 leading-none">
                  {w.title}
                </h3>
              </div>
              <div className="text-right text-xs tracking-widest uppercase text-black/60">
                <p>{w.year}</p>
                <p className="mt-1">{w.size}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
