import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { Field, TextInput, TextArea, PublishedToggle } from "@/components/admin/FormField";
import ConfirmButton from "@/components/admin/ConfirmButton";
import VideoManager from "@/components/admin/VideoManager";

const EMPTY = {
  number: "",
  title: "",
  level: "",
  question: "",
  summary: "",
  description: "",
  videos: [],
  sort_order: "0",
  published: true,
};

function toFormState(aula) {
  return { ...EMPTY, ...aula, sort_order: String(aula.sort_order ?? 0) };
}

function toPayload(form) {
  return { ...form, sort_order: Number(form.sort_order || 0) };
}

export default function AulaEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/aulas/${id}`)
      .then((res) => setForm(toFormState(res.data)))
      .catch(() => {
        toast("Aula não encontrada.");
        navigate("/admin/aulas");
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
      const payload = toPayload(form);
      if (isNew) {
        const { data } = await api.post("/admin/aulas", payload);
        toast("Aula criada.");
        navigate(`/admin/aulas/${data.id}`, { replace: true });
      } else {
        await api.put(`/admin/aulas/${id}`, payload);
        toast("Aula guardada.");
      }
    } catch (err) {
      toast(err?.response?.data?.detail || "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`/admin/aulas/${id}`);
      toast("Aula apagada.");
      navigate("/admin/aulas");
    } catch {
      toast("Não foi possível apagar.");
    }
  };

  if (loading) {
    return <p className="px-6 md:px-10 py-20 num-marker text-black/50">— A carregar</p>;
  }

  return (
    <main className="px-6 md:px-10 py-14 md:py-20" data-testid="page-admin-aula-editor">
      <title>{isNew ? "Nova técnica" : "Editar técnica"} · Painel</title>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Link to="/admin/aulas" className="num-marker link-underline text-black/60">
            ← Aulas
          </Link>
          <h1 className="mt-4 display text-4xl md:text-5xl leading-[0.95]">
            {isNew ? "Nova técnica" : form.title || "Editar técnica"}
          </h1>
        </div>
        <PublishedToggle value={form.published} onChange={update("published")} testid="aula-published-toggle" />
      </div>

      <form onSubmit={onSubmit} className="mt-12 border-t border-black" data-testid="aula-form">
        <Field label="Título">
          <TextInput value={form.title} onChange={update("title")} data-testid="aula-title-input" />
        </Field>
        <Field label="Número" hint="Ex.: 01 — mostrado na lista de técnicas.">
          <TextInput value={form.number} onChange={update("number")} />
        </Field>
        <Field label="Nível" hint="Ex.: Para iniciantes / Técnica de pintura.">
          <TextInput value={form.level} onChange={update("level")} />
        </Field>
        <Field label="Pergunta de destaque" wide hint="Frase opcional em itálico, antes do resumo.">
          <TextArea rows={2} value={form.question} onChange={update("question")} />
        </Field>
        <Field label="Resumo" wide>
          <TextArea rows={3} value={form.summary} onChange={update("summary")} />
        </Field>
        <Field label="Descrição" wide>
          <TextArea rows={3} value={form.description} onChange={update("description")} />
        </Field>
        <Field label="Ordem" hint="Técnicas com número menor aparecem primeiro na lista.">
          <TextInput type="number" value={form.sort_order} onChange={update("sort_order")} />
        </Field>

        <div className="border-b border-black py-4">
          <div className="grid grid-cols-12 gap-4 items-start">
            <span className="col-span-12 md:col-span-3 num-marker text-black/60 pt-3">
              — Vídeos e imagens
            </span>
            <div className="col-span-12 md:col-span-9">
              <VideoManager videos={form.videos} onChange={(videos) => setForm((c) => ({ ...c, videos }))} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-8">
          {isNew ? (
            <span />
          ) : (
            <ConfirmButton onConfirm={onDelete} testid="aula-delete-button">
              Apagar técnica
            </ConfirmButton>
          )}
          <button
            type="submit"
            disabled={saving}
            data-testid="aula-save-button"
            className="border border-black px-10 py-4 text-[11px] tracking-[0.32em] uppercase hover-invert disabled:opacity-40"
          >
            {saving ? "A guardar…" : "Guardar"}
          </button>
        </div>
      </form>
    </main>
  );
}
