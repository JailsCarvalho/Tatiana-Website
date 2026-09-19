import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Seo from "@/components/Seo";
import { Skeleton } from "@/components/ui/skeleton";

const MotionLink = motion(Link);

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Placeholder para artigos sem imagem de capa carregada no painel.
const FALLBACK_THUMBS = [
  "https://images.pexels.com/photos/2218452/pexels-photo-2218452.jpeg",
  "https://images.pexels.com/photos/11429042/pexels-photo-11429042.jpeg",
  "https://images.pexels.com/photos/16397789/pexels-photo-16397789.jpeg",
];

const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i;

export default function Blog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${API}/blog`)
      .then((r) => setItems(r.data.items || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="page-blog">
      <Seo
        title="Agenda | Atelier Galeria Ícone Coimbra"
        description="Notas de estúdio do Atelier Galeria Ícone em Coimbra — reflexões sobre pintura, desenho e a vida do atelier."
        path="/blog"
        keywords="Atelier de pintura em Coimbra, Aulas de arte em Coimbra, cultura Coimbra, agenda cultural Coimbra"
      />
      <section className="pt-28 md:pt-36 pb-16 px-6 md:px-10">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <p className="col-span-12 md:col-span-3 num-marker text-black/60">
            — Notas de estúdio
          </p>
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="col-span-12 md:col-span-9 display text-6xl md:text-8xl lg:text-9xl"
          >
            Agenda
          </motion.h1>
        </div>
      </section>

      <section className="border-t border-black px-6 md:px-10 py-16 md:py-24">
        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
            data-testid="blog-loading-state"
            aria-busy="true"
            aria-label="A carregar os artigos"
          >
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex flex-col">
                <Skeleton className="w-full aspect-[4/5] bg-black/[0.07] border border-black/10" />
                <div className="mt-5 flex items-baseline justify-between">
                  <Skeleton className="h-3 w-10 bg-black/[0.07]" />
                  <Skeleton className="h-3 w-20 bg-black/[0.07]" />
                </div>
                <Skeleton className="mt-4 h-8 w-4/5 bg-black/[0.07]" />
                <Skeleton className="mt-3 h-4 w-full bg-black/[0.07]" />
                <Skeleton className="mt-2 h-4 w-5/6 bg-black/[0.07]" />
                <Skeleton className="mt-4 h-3 w-24 bg-black/[0.07]" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="grid grid-cols-12 gap-6 md:gap-10 py-24 md:py-40 items-end"
            data-testid="blog-empty-state"
          >
            <div className="col-span-12 md:col-span-3 num-marker text-black/60">
              — N.º 000
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="display text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
                Sem <span className="italic">artigo</span>,<br />
                por enquanto.
              </h2>
              <p className="mt-8 font-serif text-xl md:text-2xl italic text-black/70 max-w-xl">
                O caderno está aberto. Voltamos com as primeiras notas em breve.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {items.map((p, i) => (
              <MotionLink
                to={`/blog/${p.slug}`}
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease: [0.19, 1, 0.22, 1] }}
                className="flex flex-col group"
                data-testid={`blog-${p.id}`}
              >
                <div className="spotlight overflow-hidden border border-black">
                  {p.cover_image_url ? (
                    VIDEO_EXT.test(p.cover_image_url) ? (
                      <video
                        src={p.cover_image_url}
                        className="w-full aspect-[4/5] object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <img
                        src={p.cover_image_url}
                        alt=""
                        className="w-full aspect-[4/5] object-cover"
                      />
                    )
                  ) : (
                    <img
                      src={FALLBACK_THUMBS[i % FALLBACK_THUMBS.length]}
                      alt=""
                      className="w-full aspect-[4/5] object-cover"
                    />
                  )}
                </div>
                <div className="mt-5 flex items-baseline justify-between num-marker text-black/60">
                  <span>{p.number}</span>
                  <span>{p.date}</span>
                </div>
                <h2 className="mt-4 font-serif text-3xl md:text-4xl leading-tight group-hover:italic transition-all duration-500">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm md:text-base text-black/70 leading-relaxed">
                  {p.excerpt}
                </p>
                <p className="mt-4 num-marker text-black/50">Leitura · {p.read}</p>
              </MotionLink>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
