import React from "react";
import Marquee from "react-fast-marquee";

export default function EditorialMarquee({ words }) {
  const items = words || [
    "Explorando a forma",
    "Questionando a luz",
    "Silêncio do estúdio",
    "Matéria & gesto",
    "Papel · linho · pigmento",
  ];
  return (
    <section
      data-testid="editorial-marquee"
      className="border-y border-black py-8 md:py-12 overflow-hidden bg-white"
    >
      <Marquee gradient={false} speed={22} className="marquee-serif">
        {items.map((w, i) => (
          <span key={i} className="mx-10 text-6xl md:text-8xl lg:text-9xl">
            {w}
            <span className="mx-6 align-middle">·</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
