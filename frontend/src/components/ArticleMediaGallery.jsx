import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i;

/** Galeria de imagens/vídeos adicionais de um artigo da Agenda — a capa não entra aqui. */
export default function ArticleMediaGallery({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    if (openIndex === null) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  if (!items.length) return null;

  return (
    <section
      className="border-t border-black px-6 md:px-10 py-16 md:py-24"
      data-testid="article-media-gallery"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((url, index) => {
            const isVideo = VIDEO_EXT.test(url);
            return (
              <motion.button
                type="button"
                key={`${url}-${index}`}
                onClick={() => setOpenIndex(index)}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: (index % 6) * 0.06, ease: [0.19, 1, 0.22, 1] }}
                className="group relative aspect-[4/5] overflow-hidden border border-black bg-black text-left"
                data-testid={`article-media-${index}`}
                aria-label={`Abrir ficheiro ${index + 1}`}
              >
                {isVideo ? (
                  <video
                    src={url}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                ) : (
                  <img
                    src={url}
                    alt=""
                    className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
            data-testid="article-media-lightbox"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="absolute right-5 top-5 border border-white px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white transition-colors duration-300 hover:bg-white hover:text-black md:right-10 md:top-10"
              data-testid="article-media-lightbox-close"
            >
              Fechar
            </button>
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.35 }}
              onClick={(event) => event.stopPropagation()}
              className="flex flex-col items-center gap-3 px-4 md:px-16 max-w-full"
            >
              {VIDEO_EXT.test(items[openIndex]) ? (
                <video
                  src={items[openIndex]}
                  autoPlay
                  controls
                  playsInline
                  className="max-w-full max-h-[78vh] w-auto h-auto object-contain"
                />
              ) : (
                <img
                  src={items[openIndex]}
                  alt=""
                  className="max-w-full max-h-[78vh] w-auto h-auto object-contain"
                />
              )}
              <p className="num-marker text-white/70" data-testid="article-media-lightbox-caption">
                {openIndex + 1} de {items.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
