import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function LessonVideoCard({ src, index, onOpen, isOnly }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.19, 1, 0.22, 1] }}
      className={`group relative overflow-hidden border border-black bg-black text-left ${
        isOnly ? "md:col-span-3" : index === 0 ? "md:col-span-2" : ""
      }`}
      data-testid={`aulas-video-${index + 1}`}
      aria-label={`Abrir vídeo da aula ${index + 1}`}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className={`block w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] ${
          index === 0 ? "aspect-[16/10]" : "aspect-[4/5]"
        }`}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <span className="num-marker">{index === 0 ? "Destaque" : `N.º ${String(index + 1).padStart(2, "0")}`}</span>
        <span className="num-marker opacity-0 transition-opacity duration-300 group-hover:opacity-100">Ver com som →</span>
      </div>
    </motion.button>
  );
}

export default function LessonVideoGallery({ videos, courseTitle }) {
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

  return (
    <section className="mt-20 md:mt-32 border-t border-black pt-8 md:pt-10" data-testid="aulas-video-gallery">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8 md:mb-10">
        <h3 className="display text-4xl md:text-5xl" data-testid="aulas-video-gallery-title">A aula em <span className="italic">movimento.</span></h3>
        <p className="num-marker text-black/60" data-testid="aulas-video-count">
          {videos.length === 1 ? "1 vídeo" : `${videos.length} vídeos`}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {videos.map((video, index) => (
          <LessonVideoCard
            key={video}
            src={video}
            index={index}
            onOpen={setOpenIndex}
            isOnly={videos.length === 1}
          />
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90"
            data-testid="aulas-video-lightbox"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="absolute right-5 top-5 border border-white px-5 py-3 text-[10px] tracking-[0.25em] uppercase text-white transition-colors duration-300 hover:bg-white hover:text-black md:right-10 md:top-10"
              data-testid="aulas-video-lightbox-close"
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
              <video src={videos[openIndex]} autoPlay controls playsInline className="max-w-full max-h-[78vh] w-auto h-auto object-contain" />
              <p className="num-marker text-white/70" data-testid="aulas-video-lightbox-caption">
                {courseTitle} · vídeo {openIndex + 1} de {videos.length}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}