import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api from "@/lib/api";
import { Field, TextInput, TextArea, PublishedToggle } from "@/components/admin/FormField";
import ConfirmButton from "@/components/admin/ConfirmButton";

const EMPTY = {
  index_label: "",
  title: "",
  subtitle: "",
  tagline: "",
  description: "",
  long_description: "",
  period: "",
  cadence: "",
  schedule: "",
  ages: "",
  seats: "",
  price: "",
  price_note: "",
  location: "",
  requirements: "",
  cta: "Reservar lugar",
  status: "Inscrições abertas",
  sort_order: "0",
  published: true,
};

// O backend guarda `schedule` como lista; no formulário é uma linha por horário.
function toFormState(workshop) {
  return {
    ...EMPTY,
    ...workshop,
    seats: workshop.seats ?? "",
    sort_order: String(workshop.sort_order ?? 0),
    schedule: (workshop.schedule || []).join("\n"),
  };
}

function toPayload(form) {
  return {
    ...form,
    index_label: form.index_label || null,
    seats: form.seats === "" ? null : Number(form.seats),
    sort_order: Number(form.sort_order || 0),
    schedule: form.schedule
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
  };
}

export default function WorkshopEditor() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api
      .get(`/admin/workshops/${id}`)
      .then((res) => setForm(toFormState(res.data)))
      .catch(() => {
        toast("Workshop não encontrado.");
        navigate("/admin/workshops");
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
        const { data } = await api.post("/admin/workshops", payload);
        toast("Workshop criado.");
        navigate(`/admin/workshops/${data.id}`, { replace: true });
      } else {
        await api.put(`/admin/workshops/${id}`, payload);
        toast("Workshop guardado.");
      }
    } catch (err) {
      toast(err?.response?.data?.detail || "Não foi possível guardar.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await api.delete(`/admin/workshops/${id}`);
      toast("Workshop apagado.");
      navigate("/admin/workshops");
    } catch {
      toast("Não foi possível apagar.");
    }
  };

  if (loading) {
    return <p className="px-6 md:px-10 py-20 num-marker text-black/50">— A carregar</p>;
  }

  return (
    <main className="px-6 md:px-10 py-14 md:py-20" data-testid="page-admin-workshop-editor">
      <title>{isNew ? "Novo workshop" : "Editar workshop"} · Painel</title>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Link to="/admin/workshops" className="num-marker link-underline text-black/60">
            ← Workshops
          </Link>
          <h1 className="mt-4 display text-4xl md:text-5xl leading-[0.95]">
            {isNew ? "Novo workshop" : form.title || "Editar workshop"}
          </h1>
        </div>
        <PublishedToggle
          value={form.published}
          onChange={update("published")}
          testid="workshop-published-toggle"
        />
      </div>

      <form onSubmit={onSubmit} className="mt-12 border-t border-black" data-testid="workshop-form">
        <Field label="Título" required>
          <TextInput
            value={form.title}
            onChange={update("title")}
            data-testid="workshop-title-input"
            required
          />
        </Field>
        <Field label="Subtítulo">
          <TextInput value={form.subtitle} onChange={update("subtitle")} />
        </Field>
        <Field label="Índice" hint="Ex.: 01 — número mostrado antes do período.">
          <TextInput value={form.index_label} onChange={update("index_label")} />
        </Field>
        <Field label="Frase de destaque" wide>
          <TextArea rows={2} value={form.tagline} onChange={update("tagline")} />
        </Field>
        <Field label="Descrição" wide>
          <TextArea rows={3} value={form.description} onChange={update("description")} />
        </Field>
        <Field label="Descrição longa" wide>
          <TextArea rows={4} value={form.long_description} onChange={update("long_description")} />
        </Field>
        <Field label="Período">
          <TextInput value={form.period} onChange={update("period")} placeholder="Ex.: Julho e Setembro 2026" />
        </Field>
        <Field label="Frequência">
          <TextInput value={form.cadence} onChange={update("cadence")} />
        </Field>
        <Field label="Horário" hint="Um horário por linha.">
          <TextArea rows={3} value={form.schedule} onChange={update("schedule")} />
        </Field>
        <Field label="Idades">
          <TextInput value={form.ages} onChange={update("ages")} />
        </Field>
        <Field label="Vagas">
          <TextInput type="number" min="0" value={form.seats} onChange={update("seats")} />
        </Field>
        <Field label="Preço">
          <TextInput value={form.price} onChange={update("price")} />
        </Field>
        <Field label="Nota de preço" wide>
          <TextArea rows={2} value={form.price_note} onChange={update("price_note")} />
        </Field>
        <Field label="Local">
          <TextInput value={form.location} onChange={update("location")} />
        </Field>
        <Field label="Requisitos" wide>
          <TextArea rows={2} value={form.requirements} onChange={update("requirements")} />
        </Field>
        <Field label="Texto do botão">
          <TextInput value={form.cta} onChange={update("cta")} />
        </Field>
        <Field label="Estado" hint="Ex.: Inscrições abertas / Esgotado.">
          <TextInput value={form.status} onChange={update("status")} />
        </Field>
        <Field label="Ordem" hint="Workshops com número menor aparecem primeiro.">
          <TextInput type="number" min="0" value={form.sort_order} onChange={update("sort_order")} />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-4 py-8">
          {isNew ? (
            <span />
          ) : (
            <ConfirmButton onConfirm={onDelete} testid="workshop-delete-button">
              Apagar workshop
            </ConfirmButton>
          )}
          <button
            type="submit"
            disabled={saving}
            data-testid="workshop-save-button"
            className="border border-black px-10 py-4 text-[11px] tracking-[0.32em] uppercase hover-invert disabled:opacity-40"
          >
            {saving ? "A guardar…" : "Guardar"}
          </button>
        </div>
      </form>
    </main>
  );
}
