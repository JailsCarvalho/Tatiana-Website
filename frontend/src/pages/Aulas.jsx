import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import LessonVideoGallery from "@/components/LessonVideoGallery";
import Seo from "@/components/Seo";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Aulas() {
  const [courses, setCourses] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/aulas`)
      .then((r) => {
        const items = r.data.items || [];
        setCourses(items);
        setSelectedSlug(items[0]?.slug ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const course = courses.find((item) => item.slug === selectedSlug) || courses[0];

  return (
    <main data-testid="page-aulas">
      <Seo
        title="Aulas de Pintura e Desenho em Coimbra | Técnicas de Arte"
        description="Aulas de pintura e desenho em Coimbra para adultos e crianças: pintura acrílica, óleo, aguarela, lápis de cor, pastel e desenho a carvão. Descubra a sua técnica."
        path="/aulas"
        keywords="Aulas de pintura em Coimbra, Aulas de desenho em Coimbra, Aulas de desenho e pintura, Aulas de aguarela em Coimbra, Aulas de pintura a óleo em Coimbra, Aulas de pintura acrílica em Coimbra, Aulas de desenho a carvão em Coimbra"
      />
      <section className="px-6 md:px-10 pt-28 md:pt-36 pb-16 md:pb-24">
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
          <p className="col-span-12 md:col-span-3 num-marker text-black/60" data-testid="aulas-section-label">
            — Ensino artístico · Coimbra
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 38 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            className="col-span-12 md:col-span-9 display text-5xl md:text-7xl lg:text-8xl leading-[0.88]"
            data-testid="aulas-page-title"
          >
            Aulas para <span className="italic">descobrir.</span>
          </motion.h1>
        </div>
        <p className="mt-10 w-full font-serif text-lg md:text-xl leading-snug text-black/75" data-testid="aulas-page-introduction">
          Aulas de pintura e desenho em Coimbra para adultos e crianças. Cada técnica abre uma forma diferente de observar, experimentar e construir uma prática pessoal.
        </p>
      </section>

      <section className="border-t border-black" data-testid="aulas-course-explorer">
        {loading ? (
          <p className="px-6 md:px-10 py-24 num-marker text-black/50">— A carregar</p>
        ) : courses.length === 0 ? (
          <div className="px-6 md:px-10 py-24 md:py-40" data-testid="aulas-empty-state">
            <h2 className="display text-4xl md:text-6xl leading-[0.95]">
              Novas <span className="italic">técnicas</span> em breve.
            </h2>
            <p className="mt-6 font-serif text-xl italic text-black/70 max-w-xl">
              O catálogo de aulas está a ser preparado. Volte brevemente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-12">
            <aside className="col-span-12 md:col-span-4 border-b border-black md:border-b-0 md:border-r md:border-black px-6 md:px-10 py-10 md:py-16">
              <div className="md:sticky md:top-24">
                <p className="num-marker text-black/60 mb-7">— Técnicas disponíveis</p>
                <div className="border-t border-black">
                  {courses.map((item) => {
                    const selected = item.slug === course.slug;
                    return (
                      <button
                        key={item.slug}
                        type="button"
                        onClick={() => setSelectedSlug(item.slug)}
                        aria-pressed={selected}
                        data-testid={`aulas-course-${item.slug}`}
                        className={`w-full grid grid-cols-12 gap-3 items-baseline border-b border-black py-5 text-left transition-colors duration-300 ${
                          selected ? "bg-black text-white px-4 -mx-4" : "hover:bg-black hover:text-white"
                        }`}
                      >
                        <span className="col-span-2 num-marker opacity-70">{item.number}</span>
                        <span className="col-span-10 font-serif text-2xl md:text-3xl leading-none">{item.title}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-8 max-w-xs text-sm leading-relaxed text-black/60" data-testid="aulas-future-note">
                  Novas técnicas e níveis podem ser adicionados a este programa ao longo do ano.
                </p>
              </div>
            </aside>

            <div className="col-span-12 md:col-span-8 px-6 md:px-10 py-12 md:py-16">
              <motion.div
                key={course.slug}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.19, 1, 0.22, 1] }}
                data-testid="aulas-active-course"
              >
                <div className="flex items-baseline justify-between gap-6 border-b border-black pb-6">
                  <p className="num-marker text-black/60">Técnica {course.number}</p>
                  <p className="num-marker text-right" data-testid="aulas-active-course-level">— {course.level}</p>
                </div>
                <h2 className="mt-10 display text-5xl md:text-7xl lg:text-8xl leading-[0.88]" data-testid="aulas-active-course-title">
                  {course.title.split(" ")[0]} <span className="italic">{course.title.split(" ").slice(1).join(" ")}</span>
                </h2>
                {course.question && (
                  <p className="mt-8 font-serif text-2xl md:text-3xl italic" data-testid="aulas-active-course-question">
                    {course.question}
                  </p>
                )}
                <p className="mt-12 max-w-3xl font-serif text-2xl md:text-3xl leading-[1.12]" data-testid="aulas-active-course-introduction">
                  {course.summary}
                </p>
                <div className="mt-6 max-w-3xl border-t border-black pt-6">
                  <p className="font-serif text-lg md:text-xl leading-snug text-black/80" data-testid="aulas-active-course-description">
                    {course.description}
                  </p>
                </div>
              </motion.div>

              <LessonVideoGallery videos={course.videos} courseTitle={course.title} />
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
