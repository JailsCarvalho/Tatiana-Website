import React, { useCallback, useEffect, useRef, useState } from "react";
import atelier01 from "@/assets/atelier/atelier-01.jpeg";
import atelier02 from "@/assets/atelier/atelier-02.jpeg";
import atelier03 from "@/assets/atelier/atelier-03.jpeg";
import atelier04 from "@/assets/atelier/atelier-04.jpeg";
import atelier05 from "@/assets/atelier/atelier-05.jpeg";

const images = [atelier01, atelier02, atelier03, atelier04, atelier05];

/**
 * Uma foto de cada vez, a toda a largura da coluna — arrasta/desliza para ver
 * a seguinte. scroll-snap trata do "encaixe"; o índice serve só para a
 * legenda e as setas, por isso não precisa de ficar perfeitamente exacto.
 */
export default function AtelierGallery() {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.min(images.length - 1, Math.max(0, index)));
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  };

  return (
    <div data-testid="atelier-gallery">
      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar border border-black"
      >
        {images.map((src, i) => (
          <div key={src} className="spotlight w-full shrink-0 snap-start overflow-hidden">
            <img
              src={src}
              alt={`Atelier Galeria Ícone — vista do espaço ${i + 1}`}
              className="w-full aspect-[4/5] object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="num-marker text-black/50">
          {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => goTo(Math.max(0, active - 1))}
            disabled={active === 0}
            aria-label="Foto anterior"
            data-testid="atelier-gallery-prev"
            className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert disabled:opacity-30"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTo(Math.min(images.length - 1, active + 1))}
            disabled={active === images.length - 1}
            aria-label="Foto seguinte"
            data-testid="atelier-gallery-next"
            className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
