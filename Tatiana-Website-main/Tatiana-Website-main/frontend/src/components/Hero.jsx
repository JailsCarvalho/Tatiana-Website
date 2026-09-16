import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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

const HERO_IMG =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/0lcp9hti_21.jpeg";
const HERO_VIDEO =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/30jq0ncf_TATiana.mp4";

export default function Hero() {
  const imgWrapRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("js-ready");
    const onScroll = () => {
      const y = window.scrollY * 0.08;
      if (imgWrapRef.current) {
        imgWrapRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handlePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.play();
    setPlaying(true);
  };

  return (
    <section
      data-testid="home-hero"
      className="relative px-6 md:px-10 pt-28 md:pt-32 pb-16 overflow-hidden"
    >

      {/* Compact statement */}
      <div className="grid grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-14">
        <div className="col-span-12 md:col-span-8">
          <h1 className="display text-[14vw] md:text-[9vw] lg:text-[7.5vw] leading-[0.9]">
            <MaskLine delay={0.15}>Ensinar a <span className="italic">ver</span>,</MaskLine>
            <MaskLine delay={0.32}>aprender a <span className="italic">fazer</span>.</MaskLine>
          </h1>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOut, delay: 1.0 }}
          className="col-span-12 md:col-span-4"
        >
          <p className="font-serif text-lg md:text-xl leading-snug text-black/80 max-w-sm">
            <em className="italic">Escola de desenho e pintura em Coimbra.</em>{" "}
            Um atelier aberto a quem quer aprender a olhar, desenhar e pintar,
            desde o nível inicial até ao nível avançado.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              to="/aulas"
              data-testid="hero-cta-aulas"
              className="border border-black px-6 py-3 text-[10px] tracking-[0.3em] uppercase hover-invert"
            >
              Ver aulas
            </Link>
            <Link
              to="/workshops"
              data-testid="hero-cta-workshops"
              className="border border-black px-6 py-3 text-[10px] tracking-[0.3em] uppercase hover-invert"
            >
              Workshops
            </Link>
            <a
              href="#servicos"
              data-testid="hero-cta-servicos"
              className="link-underline text-[10px] tracking-[0.3em] uppercase"
            >
              O que fazemos ↓
            </a>
          </div>
        </motion.div>
      </div>

      {/* Full-bleed horizontal atelier presentation */}
      <div ref={imgWrapRef} className="relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: easeOut, delay: 0.2 }}
          className="relative spotlight overflow-hidden border border-black group"
          data-testid="hero-media"
        >
          <video
            ref={videoRef}
            src={HERO_VIDEO}
            poster={HERO_IMG}
            preload="none"
            playsInline
            controls={playing}
            onEnded={() => setPlaying(false)}
            onPause={() => setPlaying(false)}
            className="block w-full h-[52vh] md:h-[72vh] object-cover bg-black"
          />
          {!playing && (
            <>
              <img
                src={HERO_IMG}
                alt="O atelier a trabalhar — Galeria-Atelier Ícone, Coimbra"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                aria-hidden="true"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0" />
              <button
                type="button"
                onClick={handlePlay}
                data-testid="hero-play-btn"
                aria-label="Reproduzir vídeo do atelier"
                className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/10 transition-colors duration-500"
              >
                <span className="flex items-center justify-center w-24 h-24 md:w-32 md:h-32 border border-white text-white bg-black/40 backdrop-blur-sm transition-all duration-500 group-hover:bg-black/60 group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-[2px]"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            </>
          )}
          {/* Overlay captions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.4 }}
            className="pointer-events-none absolute left-6 bottom-6 md:left-8 md:bottom-8 text-white"
          >
            <p className="num-marker text-white/80">Fig. 01</p>
            <p className="font-serif text-xl md:text-2xl italic mt-1">
              O atelier a trabalhar, Coimbra.
            </p>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.5 }}
            className="pointer-events-none absolute right-6 bottom-6 md:right-8 md:bottom-8 num-marker text-white/80"
          >
            {playing ? "" : "Clique para ver o vídeo"}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
