import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default function WorkshopsList() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/workshops")
      .then((res) => setWorkshops(res.data))
      .catch(() => toast("Não foi possível carregar os workshops."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    try {
      await api.delete(`/admin/workshops/${id}`);
      setWorkshops((current) => current.filter((w) => w.id !== id));
      toast("Workshop apagado.");
    } catch {
      toast("Não foi possível apagar.");
    }
  };

  return (
    <main className="px-6 md:px-10 py-14 md:py-20" data-testid="page-admin-workshops">
      <title>Workshops · Painel</title>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="num-marker text-black/60">— Painel</p>
          <h1 className="mt-4 display text-5xl md:text-6xl leading-[0.9]">Workshops</h1>
        </div>
        <Link
          to="/admin/workshops/novo"
          data-testid="workshop-new-link"
          className="border border-black px-6 py-3 text-[11px] tracking-[0.3em] uppercase hover-invert"
        >
          Novo workshop
        </Link>
      </div>

      <section className="mt-12 border-t border-black" data-testid="admin-workshops-list">
        {loading ? (
          <p className="py-10 num-marker text-black/50">— A carregar</p>
        ) : workshops.length === 0 ? (
          <p className="py-16 font-serif text-2xl italic text-black/60">
            Ainda não há workshops criados.
          </p>
        ) : (
          workshops.map((workshop) => (
            <article
              key={workshop.id}
              className="grid grid-cols-12 gap-4 md:gap-8 items-center border-b border-black py-6"
              data-testid={`admin-workshop-${workshop.id}`}
            >
              <div className="col-span-12 md:col-span-6">
                <h2 className="font-serif text-2xl md:text-3xl leading-tight">{workshop.title}</h2>
                <p className="mt-1 num-marker text-black/50">
                  {workshop.subtitle || "Sem subtítulo"} — {workshop.period || "Sem período definido"}
                </p>
              </div>
              <div className="col-span-6 md:col-span-2">
                <span
                  className={`inline-block border px-3 py-1.5 text-[10px] tracking-[0.24em] uppercase ${
                    workshop.published ? "border-black bg-black text-white" : "border-black/40 text-black/50"
                  }`}
                >
                  {workshop.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div className="col-span-6 md:col-span-1 num-marker text-black/50">
                {workshop.seats ?? "—"} vagas
              </div>
              <div className="col-span-12 md:col-span-3 flex justify-end gap-3">
                <Link
                  to={`/admin/workshops/${workshop.id}`}
                  className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert"
                >
                  Editar
                </Link>
                <ConfirmButton onConfirm={() => onDelete(workshop.id)} testid={`workshop-delete-${workshop.id}`} />
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
