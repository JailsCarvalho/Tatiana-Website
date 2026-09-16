import React from "react";
import Hero from "@/components/Hero";
import EditorialMarquee from "@/components/EditorialMarquee";
import Services from "@/components/Services";
import Materials from "@/components/Materials";
import AtelierSpace from "@/components/AtelierSpace";
import MeetFounder from "@/components/MeetFounder";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div data-testid="page-home">
      <Seo
        title="Aulas de Pintura e Desenho em Coimbra | Atelier Galeria Ícone"
        description="Atelier de pintura e desenho em Coimbra. Aulas de arte para adultos e crianças — pintura acrílica, óleo, aguarela e desenho a carvão. Marque uma aula experimental."
        path="/"
        keywords="Aulas de pintura em Coimbra, Aulas de desenho em Coimbra, Atelier de pintura em Coimbra, Aulas de arte em Coimbra, Aulas de desenho e pintura, Curso de pintura em Coimbra, Escola de desenho em Coimbra"
      />
      <Hero />
      <Services />
      <Materials />
      <AtelierSpace />
      
      {/* Final CTA band */}
      <section className="border-t border-black px-6 md:px-10 py-24 md:py-40">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="col-span-12 md:col-span-3 num-marker text-black/60">
            — Visitar o atelier
          </div>
          <div className="col-span-12 md:col-span-9">
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
              className="display text-5xl md:text-7xl lg:text-8xl mb-10"
            >
              Marque uma <span className="italic">visita</span>.<br />
              Traga o seu <span className="italic">tempo</span>.
            </motion.h2>
            <p className="max-w-2xl font-serif text-xl md:text-2xl text-black/75 mb-10">
              Aulas experimentais gratuitas mediante marcação. Venha conhecer o
              espaço, os cavaletes e o resto do grupo — e decida sem pressa.
            </p>
            <div className="flex flex-wrap gap-6 items-center">
              <a
                href="#contacto"
                data-testid="home-cta-contact"
                className="border border-black px-8 py-4 text-[11px] tracking-[0.3em] uppercase hover-invert"
              >
                Escrever ao atelier
              </a>
              <Link
                to="/aulas"
                data-testid="home-cta-aulas-bottom"
                className="link-underline text-[11px] tracking-[0.3em] uppercase"
              >
                Ver todas as aulas →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
