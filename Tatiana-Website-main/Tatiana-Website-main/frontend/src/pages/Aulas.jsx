import React, { useState } from "react";
import { motion } from "framer-motion";
import LessonVideoGallery from "@/components/LessonVideoGallery";
import Seo from "@/components/Seo";

const courses = [
  {
    id: "pintura-acrilica",
    number: "01",
    title: "Pintura Acrílica",
    level: "Para iniciantes",
    summary:
      "Versátil, vibrante e cheia de possibilidades, a pintura acrílica permite explorar cores, texturas e diferentes formas de expressão em conjugação com outros materiais.",
    description:
      "Uma técnica fácil, mas com enorme potencial criativo — perfeita para experimentar, aprender e desenvolver uma linguagem artística.",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/ifql64qo_Video-80918.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/fbqqpbmv_WhatsApp%20Video%202026-09-10%20at%2011.57.30%20%281%29.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/ji187igt_WhatsApp%20Video%202026-09-10%20at%2011.57.30.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/e8xlg3qs_WhatsApp%20Video%202026-09-12%20at%2009.54.56.mp4",
    ],
  },
  {
    id: "carvao-grafite",
    number: "02",
    title: "Carvão e Grafite",
    level: "Desenho de observação",
    question: "Gosta de desenho?",
    summary:
      "Aprenda a observar, tirar medidas, compreender proporções e visualizar no espaço, desenvolvendo o rigor e a sensibilidade do olhar.",
    description:
      "Através do carvão e da grafite, explore a luz, a sombra, o contraste e diferentes texturas, dando mais expressão e profundidade aos seus desenhos.",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/q36p2h3r_WhatsApp%20Video%202026-09-12%20at%2010.36.50.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/puc35ywn_WhatsApp%20Video%202026-09-12%20at%2010.13.22.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/mlt7wh3r_WhatsApp%20Video%202026-09-12%20at%2010.05.12.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/2mrpwmlg_WhatsApp%20Video%202026-09-12%20at%2010.03.16.mp4",
    ],
  },
  {
    id: "pintura-oleo",
    number: "03",
    title: "Pintura a Óleo",
    level: "Técnica de pintura",
    question: "Deixe a cor ganhar vida na tela.",
    summary:
      "Descubra a magia da pintura a óleo e aprenda a trabalhar luz, cor, sombras, volume e textura, desenvolvendo a sua técnica e criando obras cheias de profundidade e expressão.",
    description:
      "Gosta de pintar? Venha experimentar e descubra o prazer de criar!",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/0jynmqk3_WhatsApp%20Video%202026-09-12%20at%2010.59.16.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/a1qil1ax_WhatsApp%20Video%202026-09-12%20at%2010.57.29.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/gdfoggr1_WhatsApp%20Video%202026-09-12%20at%2010.54.08.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/ah937era_WhatsApp%20Video%202026-09-12%20at%2010.50.51.mp4",
    ],
  },
  {
    id: "pintura-aguarela",
    number: "04",
    title: "Pintura em Aguarela",
    level: "Técnica de pintura",
    summary:
      "A aguarela é uma técnica delicada e luminosa, onde a água e a cor se encontram para criar transparências, texturas e efeitos únicos.",
    description:
      "Uma forma leve e expressiva de explorar a criatividade e dar vida ao papel através da cor.",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/qmwpo4hj_WhatsApp%20Video%202026-09-12%20at%2015.06.03.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/6qbdskoa_WhatsApp%20Video%202026-09-12%20at%2014.43.05.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/ywdtcjzk_WhatsApp%20Video%202026-09-12%20at%2014.23.59.mp4",
    ],
  },
  {
    id: "lapis-cor",
    number: "05",
    title: "Lápis de Cor",
    level: "Técnica de desenho",
    summary:
      "Descubra o universo dos lápis de cor e aprenda a criar desenhos ricos em cor, luz e profundidade.",
    description:
      "Através da mistura de tons, camadas e diferentes técnicas, damos vida ao papel e em outros materiais e exploramos toda a criatividade.",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/lb1t1w26_WhatsApp%20Video%202026-09-12%20at%2016.02.42.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/y6b9whe6_WhatsApp%20Video%202026-09-12%20at%2015.48.33.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/o7efr1z8_WhatsApp%20Video%202026-09-12%20at%2015.10.32.mp4",
    ],
  },
  {
    id: "pastel-oleo",
    number: "06",
    title: "Pastel de Óleo",
    level: "Técnica de desenho",
    question: "Mergulhe num mundo de cor, textura e criatividade!",
    summary:
      "O pastel de óleo permite criar obras vibrantes e cheias de expressão, explorando misturas de cores, luz, sombras e diferentes texturas.",
    description:
      "Uma técnica envolvente, divertida e surpreendente. Perfeita para dar liberdade à imaginação! 🖍️",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/vv90z8e8_WhatsApp%20Video%202026-09-12%20at%2017.31.57.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/4fcmoasv_WhatsApp%20Video%202026-09-12%20at%2017.24.05.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/2xcrwfhv_WhatsApp%20Video%202026-09-12%20at%2017.09.27.mp4",
    ],
  },
  {
    id: "tecnicas-mistas",
    number: "07",
    title: "Técnicas Mistas",
    level: "Exploração criativa",
    question: "Misturar, experimentar e criar!",
    summary:
      "Nas Técnicas Mistas, exploramos diferentes materiais e possibilidades, combinando desenho, pintura, textura e cor para criar trabalhos únicos e cheios de expressão.",
    description:
      "Solte a imaginação e descubra até onde pode levar a sua criatividade!",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/fu8fo1xs_WhatsApp%20Video%202026-09-12%20at%2017.39.03.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/8cvrt3xc_WhatsApp%20Video%202026-09-12%20at%2017.35.28.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/6psppww1_WhatsApp%20Video%202026-09-12%20at%2017.34.42.mp4",
    ],
  },
  {
    id: "tinta-china",
    number: "08",
    title: "Tinta da China",
    level: "Técnica de desenho",
    question: "Descubra a força do traço, o contraste e a expressividade da Tinta da China.",
    summary:
      "Uma técnica que permite explorar linhas, manchas, sombras e diferentes intensidades, criando desenhos marcantes e cheios de personalidade.",
    description:
      "Experimente, arrisque e deixe o seu traço ganhar vida!",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/3ct70mk7_WhatsApp%20Video%202026-09-12%20at%2018.32.16.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/mwl5kaj8_WhatsApp%20Video%202026-09-12%20at%2018.32.18.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/7l26jxpq_WhatsApp%20Video%202026-09-12%20at%2018.13.16.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/85hm0snj_WhatsApp%20Video%202026-09-12%20at%2018.12.13.mp4",
    ],
  },
  {
    id: "canetas-acrilicas",
    number: "09",
    title: "Canetas Acrílicas",
    level: "Técnica de pintura",
    question: "Dê vida às suas ideias com as CANETAS ACRÍLICAS!",
    summary:
      "Uma técnica versátil e vibrante, perfeita para criar cores intensas, detalhes, texturas e efeitos originais em diferentes superfícies.",
    description:
      "Gosta de experimentar e explorar novas formas de pintar? Venha descobrir o mundo das CANETAS ACRÍLICAS!",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/hz21yndz_WhatsApp%20Video%202026-09-12%20at%2018.43.38%20%281%29.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/cy9trrkl_WhatsApp%20Video%202026-09-12%20at%2019.12.39.mp4",
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/i3fn6j6h_WhatsApp%20Video%202026-09-12%20at%2018.43.38.mp4",
    ],
  },
  {
    id: "canetas-copic",
    number: "10",
    title: "Canetas Copic",
    level: "Ilustração e cor",
    question: "Descubra a magia da cor com as CANETAS COPIC!",
    summary:
      "Aprenda a criar degradés, sombras, volumes e combinações de cor, dando vida e intensidade às suas ilustrações.",
    description:
      "Uma técnica divertida e criativa, perfeita para quem gosta de explorar a cor e a ilustração. Gosta de desenhar e experimentar novas técnicas? Venha descobrir o mundo das CANETAS COPIC!",
    videos: [
      "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/w7klqmrm_Video-79310.mp4",
    ],
  },
];

export default function Aulas() {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0].id);
  const course = courses.find((item) => item.id === selectedCourseId) || courses[0];

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
        <div className="grid grid-cols-12">
          <aside className="col-span-12 md:col-span-4 border-b border-black md:border-b-0 md:border-r md:border-black px-6 md:px-10 py-10 md:py-16">
            <div className="md:sticky md:top-24">
              <p className="num-marker text-black/60 mb-7">— Técnicas disponíveis</p>
              <div className="border-t border-black">
                {courses.map((item) => {
                  const selected = item.id === course.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedCourseId(item.id)}
                      aria-pressed={selected}
                      data-testid={`aulas-course-${item.id}`}
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
              key={course.id}
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
      </section>
    </main>
  );
}