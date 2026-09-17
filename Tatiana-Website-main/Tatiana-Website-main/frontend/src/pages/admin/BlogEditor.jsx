import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import api from "@/lib/api";
import { Field, TextInput, TextArea, PublishedToggle } from "@/components/admin/FormField";
import ConfirmButton from "@/components/admin/ConfirmButton";

const EMPTY = {
  title: "",
  excerpt: "",
  cover_image_url: "",
  read_time: "",
  content_md: "",
  published: false,
};

export default function BlogEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("escrever");

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/blog/${id}`)
      .then((res) => setForm({ ...EMPTY, ...res.data }))
      .catch(() => {
        toast("Artigo não encontrado.");
        navigate("/admin/blog");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const update = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast("O título é obrigatório.");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        const { data } = await api.post("/admin/blog", form);
        toast("Artigo criado.");
        navigate(`/admin/blog/${data.id}`, { replace: true });
      } else {
        await api.put(`/admin/blog/${id}`, form);
        toast("Artigo guardado.");
      }
    } catch (err) {
      toast(err?.response?.data?.detail || "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`/admin/blog/${id}`);
      toast("Artigo apagado.");
      navigate("/admin/blog");
    } catch {
      toast("Não foi possível apagar.");
    }
  };

  if (loading) {
    return <p className="px-6 md:px-10 py-20 num-marker text-black/50">— A carregar</p>;
  }

  return (
    <main className="px-6 md:px-10 py-14 md:py-20" data-testid="page-admin-blog-editor">
      <title>{isNew ? "Novo artigo" : "Editar artigo"} · Painel</title>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Link to="/admin/blog" className="num-marker link-underline text-black/60">
            ← Diário de bordo
          </Link>
          <h1 className="mt-4 display text-4xl md:text-5xl leading-[0.95]">
            {isNew ? "Novo artigo" : form.title || "Editar artigo"}
          </h1>
        </div>
        <PublishedToggle value={form.published} onChange={update("published")} testid="blog-published-toggle" />
      </div>

      <form onSubmit={onSubmit} className="mt-12 border-t border-black" data-testid="blog-form">
        <Field label="Título" required>
          <TextInput
            value={form.title}
            onChange={update("title")}
            data-testid="blog-title-input"
            required
          />
        </Field>
        <Field label="Resumo" wide hint="Mostrado na listagem do blog.">
          <TextArea rows={2} value={form.excerpt} onChange={update("excerpt")} />
        </Field>
        <Field label="Imagem de capa" hint="URL de uma imagem já publicada algures.">
          <TextInput value={form.cover_image_url} onChange={update("cover_image_url")} placeholder="https://…" />
        </Field>
        <Field label="Tempo de leitura" hint="Ex.: 4 min">
          <TextInput value={form.read_time} onChange={update("read_time")} />
        </Field>

        <div className="border-b border-black py-4">
          <div className="grid grid-cols-12 gap-4 items-start">
            <span className="col-span-12 md:col-span-3 num-marker text-black/60 pt-3">
              — Conteúdo (Markdown)
            </span>
            <div className="col-span-12 md:col-span-9">
              <div className="flex gap-2 mb-3">
                {[
                  ["escrever", "Escrever"],
                  ["pre-visualizar", "Pré-visualizar"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTab(key)}
                    data-testid={`blog-tab-${key}`}
                    className={`px-4 py-2 text-[10px] tracking-[0.28em] uppercase border border-black ${
                      tab === key ? "bg-black text-white" : "hover-invert"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {tab === "escrever" ? (
                <TextArea
                  rows={16}
                  value={form.content_md}
                  onChange={update("content_md")}
                  data-testid="blog-content-input"
                  className="font-mono text-sm leading-relaxed"
                  placeholder={"# Título do artigo\n\nEscreva aqui em Markdown — **negrito**, *itálico*, [links](https://…), listas…"}
                />
              ) : (
                <div
                  className="prose-admin min-h-[16rem] border-b border-black/20 py-3"
                  data-testid="blog-content-preview"
                >
                  {form.content_md.trim() ? (
                    <ReactMarkdown>{form.content_md}</ReactMarkdown>
                  ) : (
                    <p className="font-serif italic text-black/40">Nada para mostrar ainda.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-8">
          {isNew ? (
            <span />
          ) : (
            <ConfirmButton onConfirm={onDelete} testid="blog-delete-button">
              Apagar artigo
            </ConfirmButton>
          )}
          <button
            type="submit"
            disabled={saving}
            data-testid="blog-save-button"
            className="border border-black px-10 py-4 text-[11px] tracking-[0.32em] uppercase hover-invert disabled:opacity-40"
          >
            {saving ? "A guardar…" : "Guardar"}
          </button>
        </div>
      </form>
    </main>
  );
}
