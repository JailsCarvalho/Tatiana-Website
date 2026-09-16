import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const SECTIONS = [
  {
    key: "blog",
    number: "01",
    title: "Diário de bordo",
    description: "Artigos do blog — escrever, editar e publicar.",
    endpoint: "/blog",
    unit: "artigo(s) publicado(s)",
  },
  {
    key: "workshops",
    number: "02",
    title: "Workshops",
    description: "Programas e imersões, com datas, vagas e inscrições.",
    endpoint: "/workshops",
    unit: "workshop(s) activo(s)",
  },
  {
    key: "aulas",
    number: "03",
    title: "Aulas",
    description: "Técnicas do atelier e as galerias de vídeo de cada uma.",
    endpoint: "/aulas",
    unit: "técnica(s) no catálogo",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadCounts = Promise.all(
      SECTIONS.map((section) =>
        api
          .get(section.endpoint)
          .then((res) => [section.key, (res.data.items || []).length])
          .catch(() => [section.key, null]),
      ),
    );

    Promise.all([loadCounts, api.get("/contact", { params: { limit: 5 } }).catch(() => null)])
      .then(([entries, contactRes]) => {
        if (!active) return;
        setCounts(Object.fromEntries(entries));
        setMessages(contactRes?.data || []);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const firstName = (user?.name || user?.email || "").split(/[\s@]/)[0];

  return (
    <main className="px-6 md:px-10 py-14 md:py-20" data-testid="page-admin-dashboard">
      <title>Painel · Atelier Galeria Ícone</title>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <p className="num-marker text-black/60">— Bem-vinda</p>
        <h1 className="mt-5 display text-5xl md:text-7xl leading-[0.9]">
          Olá, <span className="italic">{firstName || "Tatiana"}</span>.
        </h1>
        <p className="mt-6 max-w-xl text-sm md:text-base leading-relaxed text-black/70">
          Este é o painel do site. A gestão de conteúdo de cada secção entra em
          funcionamento nas próximas fases — por agora já pode consultar o que
          está publicado e as mensagens recebidas pelo formulário de contacto.
        </p>
      </motion.div>

      <section className="mt-16 border-t border-black" data-testid="admin-sections">
        {SECTIONS.map((section) => (
          <article
            key={section.key}
            className="grid grid-cols-12 gap-4 md:gap-8 items-baseline border-b border-black py-8"
            data-testid={`admin-section-${section.key}`}
          >
            <span className="col-span-2 md:col-span-1 num-marker text-black/50">
              {section.number}
            </span>
            <div className="col-span-10 md:col-span-6">
              <h2 className="font-serif text-3xl md:text-4xl leading-none">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/60">{section.description}</p>
            </div>
            <div className="col-span-12 md:col-span-3 num-marker text-black/60">
              {loading
                ? "— A carregar"
                : counts[section.key] === null
                  ? "— Indisponível"
                  : `— ${counts[section.key]} ${section.unit}`}
            </div>
            <div className="col-span-12 md:col-span-2 md:text-right">
              <span className="inline-block border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase text-black/50">
                Em breve
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-16" data-testid="admin-messages">
        <div className="flex items-baseline justify-between gap-4 border-b border-black pb-5">
          <h2 className="font-serif text-3xl md:text-4xl leading-none">Mensagens recebidas</h2>
          <span className="num-marker text-black/50">— Últimas {messages.length}</span>
        </div>

        {loading ? (
          <p className="py-10 num-marker text-black/50">— A carregar</p>
        ) : messages.length === 0 ? (
          <p className="py-10 font-serif text-xl italic text-black/60" data-testid="admin-messages-empty">
            Ainda não há mensagens do formulário de contacto.
          </p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                className="grid grid-cols-12 gap-4 md:gap-8 border-b border-black py-6 items-baseline"
                data-testid={`admin-message-${message.id}`}
              >
                <div className="col-span-12 md:col-span-3">
                  <p className="font-serif text-xl leading-tight">{message.name}</p>
                  <p className="mt-1 num-marker text-black/50 lowercase tracking-[0.12em]">
                    {message.email}
                  </p>
                </div>
                <div className="col-span-12 md:col-span-7">
                  <p className="num-marker text-black/50">— {message.subject || "Sem assunto"}</p>
                  <p className="mt-2 text-sm leading-relaxed text-black/75">{message.message}</p>
                </div>
                <div className="col-span-12 md:col-span-2 num-marker text-black/50 md:text-right">
                  {new Date(message.created_at).toLocaleDateString("pt-PT")}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
