import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import ConfirmButton from "@/components/admin/ConfirmButton";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/admin/blog")
      .then((res) => setPosts(res.data))
      .catch(() => toast("Não foi possível carregar os artigos."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const onDelete = async (id) => {
    try {
      await api.delete(`/admin/blog/${id}`);
      setPosts((current) => current.filter((p) => p.id !== id));
      toast("Artigo apagado.");
    } catch {
      toast("Não foi possível apagar.");
    }
  };

  return (
    <main className="px-6 md:px-10 py-14 md:py-20" data-testid="page-admin-blog">
      <title>Diário de bordo · Painel</title>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="num-marker text-black/60">— Painel</p>
          <h1 className="mt-4 display text-5xl md:text-6xl leading-[0.9]">Diário de bordo</h1>
        </div>
        <Link
          to="/admin/blog/novo"
          data-testid="blog-new-link"
          className="border border-black px-6 py-3 text-[11px] tracking-[0.3em] uppercase hover-invert"
        >
          Novo artigo
        </Link>
      </div>

      <section className="mt-12 border-t border-black" data-testid="admin-blog-list">
        {loading ? (
          <p className="py-10 num-marker text-black/50">— A carregar</p>
        ) : posts.length === 0 ? (
          <p className="py-16 font-serif text-2xl italic text-black/60">
            Ainda não há artigos escritos.
          </p>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="grid grid-cols-12 gap-4 md:gap-8 items-center border-b border-black py-6"
              data-testid={`admin-blog-${post.id}`}
            >
              <div className="col-span-12 md:col-span-6">
                <h2 className="font-serif text-2xl md:text-3xl leading-tight">{post.title}</h2>
                <p className="mt-1 num-marker text-black/50">{post.excerpt || "Sem resumo"}</p>
              </div>
              <div className="col-span-6 md:col-span-2">
                <span
                  className={`inline-block border px-3 py-1.5 text-[10px] tracking-[0.24em] uppercase ${
                    post.published ? "border-black bg-black text-white" : "border-black/40 text-black/50"
                  }`}
                >
                  {post.published ? "Publicado" : "Rascunho"}
                </span>
              </div>
              <div className="col-span-6 md:col-span-1 num-marker text-black/50">
                {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-PT") : "—"}
              </div>
              <div className="col-span-12 md:col-span-3 flex justify-end gap-3">
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert"
                >
                  Editar
                </Link>
                <ConfirmButton onConfirm={() => onDelete(post.id)} testid={`blog-delete-${post.id}`} />
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}
