import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default function AulasList() {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/aulas")
      .then((res) => setAulas(res.data))
      .catch(() => toast("Não foi possível carregar as aulas."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    try {
      await api.delete(`/admin/aulas/${id}`);
      setAulas((current) => current.filter((a) => a.id !== id));
      toast("Aula apagada.");
    } catch {
      toast("Não foi possível apagar.");
    }
  };

  // Troca a ordem com a vizinha e persiste as duas — a lista pública usa
  // sort_order para decidir a sequência das técnicas.
  const move = async (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= aulas.length) return;

    const next = [...aulas];
    [next[index], next[target]] = [next[target], next[index]];
    setAulas(next);

    try {
      await Promise.all([
        api.put(`/admin/aulas/${next[index].id}`, { ...next[index], sort_order: index }),
        api.put(`/admin/aulas/${next[target].id}`, { ...next[target], sort_order: target }),
      ]);
      load();
    } catch {
      toast("Não foi possível reordenar.");
      load();
    }
  };

  return (
    <main className="px-6 md:px-10 py-14 md:py-20" data-testid="page-admin-aulas">
      <title>Aulas · Painel</title>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="num-marker text-black/60">— Painel</p>
          <h1 className="mt-4 display text-5xl md:text-6xl leading-[0.9]">Aulas</h1>
        </div>
        <Link
          to="/admin/aulas/nova"
          data-testid="aula-new-link"
          className="border border-black px-6 py-3 text-[11px] tracking-[0.3em] uppercase hover-invert"
        >
          Nova técnica
        </Link>
      </div>

      <section className="mt-12 border-t border-black" data-testid="admin-aulas-list">
        {loading ? (
          <p className="py-10 num-marker text-black/50">— A carregar</p>
        ) : aulas.length === 0 ? (
          <p className="py-16 font-serif text-2xl italic text-black/60">
            Ainda não há técnicas no catálogo.
          </p>
        ) : (
          aulas.map((aula, index) => (
            <article
              key={aula.id}
              className="grid grid-cols-12 gap-4 md:gap-8 items-center border-b border-black py-6"
              data-testid={`admin-aula-${aula.id}`}
            >
              <div className="col-span-1 flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="text-black/50 hover:text-black disabled:opacity-20"
                  aria-label="Mover para cima"
                  data-testid={`aula-move-up-${aula.id}`}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === aulas.length - 1}
                  className="text-black/50 hover:text-black disabled:opacity-20"
                  aria-label="Mover para baixo"
                  data-testid={`aula-move-down-${aula.id}`}
                >
                  ↓
                </button>
              </div>
              <div className="col-span-11 md:col-span-5">
                <h2 className="font-serif text-2xl md:text-3xl leading-tight">{aula.title}</h2>
                <p className="mt-1 num-marker text-black/50">
                  {aula.level || "Sem nível"} — {aula.videos.length} vídeo(s)
                </p>
              </div>
              <div className="col-span-6 md:col-span-2">
                <span
                  className={`inline-block border px-3 py-1.5 text-[10px] tracking-[0.24em] uppercase ${
                    aula.published ? "border-black bg-black text-white" : "border-black/40 text-black/50"
                  }`}
                >
                  {aula.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div className="col-span-12 md:col-span-4 flex justify-end gap-3">
                <Link
                  to={`/admin/aulas/${aula.id}`}
                  className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert"
                >
                  Editar
                </Link>
                <ConfirmButton onConfirm={() => onDelete(aula.id)} testid={`aula-delete-${aula.id}`} />
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
