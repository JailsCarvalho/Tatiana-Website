import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const videos = [
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/6k6w8xfb_WhatsApp%20Video%202026-07-21%20at%2013.49.17.mp4",
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/gn36g2fo_WhatsApp%20Video%202026-07-21%20at%2014.58.24.mp4",
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/bbxiokl6_WhatsApp%20Video%202026-07-21%20at%2015.00.17.mp4",
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/k4904jb5_WhatsApp%20Video%202026-07-21%20at%2015.01.36.mp4",
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/rrtqonp9_WhatsApp%20Video%202026-07-21%20at%2015.03.11.mp4",
];

/**
 * Silent muted-autoplay thumbnail. Click to open lightbox with sound.
 */
function VideoThumb({ src, index, onOpen, featured = false }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // ensure inline autoplay on iOS
    v.muted = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        });
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: [0.19, 1, 0.22, 1] }}
      className={`relative group text-left border border-black overflow-hidden bg-black ${
        featured ? "md:col-span-2" : ""
      }`}
      data-testid={featured ? "workshop-video-featured" : `workshop-video-${index + 1}`}
      aria-label={featured ? "Abrir vídeo em destaque" : `Abrir vídeo ${index + 1}`}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className={`w-full object-cover ${
          featured ? "h-[52vh] md:h-[62vh]" : "h-[42vh] md:h-[52vh]"
        }`}
      />
      {/* overlay hint */}
      <div className="absolute inset-0 flex items-end justify-between p-4 md:p-6 text-white pointer-events-none">
        <span className="num-marker">
          {featured ? "Destaque" : `N.º ${String(index + 1).padStart(2, "0")}`}
        </span>
        <span className={`num-marker transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-70"}`}>
          Abrir · com som →
        </span>
      </div>
      {/* subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </motion.button>
  );
}

export default function VideoGallery() {
  const [openIndex, setOpenIndex] = useState(null);
  const modalVideoRef = useRef(null);

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpenIndex(null);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i + 1) % videos.length);
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i - 1 + videos.length) % videos.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [openIndex]);

  return (
    <section
      data-testid="workshop-video-gallery"
      className="border-t border-black px-6 md:px-10 py-24 md:py-40"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {videos.map((src, i) => (
          <VideoThumb
            key={src}
            src={src}
            index={i}
            onOpen={setOpenIndex}
            featured={i === 0}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
            onClick={() => setOpenIndex(null)}
            data-testid="workshop-video-lightbox"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="absolute top-6 right-6 md:top-10 md:right-10 border border-white/60 text-white px-6 py-2 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors duration-400"
              data-testid="workshop-video-close"
            >
              Fechar ✕
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i - 1 + videos.length) % videos.length); }}
              className="hidden md:block absolute left-8 top-1/2 -translate-y-1/2 border border-white/60 text-white px-4 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors duration-400"
              aria-label="Anterior"
            >
              ←
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setOpenIndex((i) => (i + 1) % videos.length); }}
              className="hidden md:block absolute right-8 top-1/2 -translate-y-1/2 border border-white/60 text-white px-4 py-3 text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors duration-400"
              aria-label="Próximo"
            >
              →
            </button>

            <motion.div
              key={openIndex}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="relative flex flex-col items-center gap-4 px-4 md:px-20 max-w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={modalVideoRef}
                src={videos[openIndex]}
                autoPlay
                controls
                playsInline
                className="max-w-full max-h-[78vh] w-auto h-auto object-contain"
              />
              <div className="flex justify-between w-full max-w-3xl num-marker text-white/80">
                <span>N.º {String(openIndex + 1).padStart(2, "0")} · Workshop Verão</span>
                <span>{openIndex + 1} / {videos.length}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
