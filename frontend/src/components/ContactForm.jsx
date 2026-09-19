import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ContactForm({ topic = "general", defaultSubject = "", dark = false }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: defaultSubject,
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast("Preencha nome, email e mensagem.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/contact`, { ...form, topic });
      if (data?.email_sent) {
        toast("Mensagem enviada — respondemos em breve.");
      } else {
        toast("Mensagem recebida — respondemos em breve.");
      }
      setForm({ name: "", email: "", subject: defaultSubject, message: "" });
    } catch (err) {
      console.error(err);
      toast("Não foi possível enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const borderCls = dark ? "border-white/40" : "border-black";
  const labelCls = dark ? "text-white/60" : "text-black/60";
  const inputPlaceholder = dark ? "placeholder:text-white/30 text-white" : "placeholder:text-black/30 text-black";
  const btnCls = dark
    ? "border border-white text-white hover:bg-white hover:text-black transition-colors duration-400"
    : "border border-black hover-invert";

  return (
    <form
      data-testid="contact-form"
      onSubmit={onSubmit}
      className={`border-t ${borderCls}`}
    >
      <Field label="Nome" testid="contact-name" dark={dark}>
        <input
          data-testid="contact-input-name"
          type="text"
          value={form.name}
          onChange={update("name")}
          placeholder="O seu nome"
          className={`w-full bg-transparent outline-none py-4 text-lg font-serif ${inputPlaceholder}`}
        />
      </Field>
      <Field label="Email" testid="contact-email" dark={dark}>
        <input
          data-testid="contact-input-email"
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="voce@dominio.pt"
          className={`w-full bg-transparent outline-none py-4 text-lg font-serif ${inputPlaceholder}`}
        />
      </Field>
      <Field label="Assunto" testid="contact-subject" dark={dark}>
        <input
          data-testid="contact-input-subject"
          type="text"
          value={form.subject}
          onChange={update("subject")}
          placeholder="Ex.: Encomenda, workshop de Março…"
          className={`w-full bg-transparent outline-none py-4 text-lg font-serif ${inputPlaceholder}`}
        />
      </Field>
      <Field label="Mensagem" testid="contact-message" dark={dark} last>
        <textarea
          data-testid="contact-input-message"
          rows={4}
          value={form.message}
          onChange={update("message")}
          placeholder="Escreva algumas linhas…"
          className={`w-full bg-transparent outline-none py-4 text-lg font-serif resize-none ${inputPlaceholder}`}
        />
      </Field>
      <button
        data-testid="contact-submit"
        type="submit"
        disabled={loading}
        className={`mt-8 w-full md:w-auto px-10 py-4 text-[11px] tracking-[0.32em] uppercase disabled:opacity-40 ${btnCls}`}
      >
        {loading ? "A enviar…" : "Enviar mensagem"}
      </button>
    </form>
  );
}

function Field({ label, children, testid, last, dark }) {
  const border = dark ? "border-white/40" : "border-black";
  const labelColor = dark ? "text-white/60" : "text-black/60";
  return (
    <div
      data-testid={`${testid}-field`}
      className={`grid grid-cols-12 items-baseline gap-4 ${border} ${last ? "border-b" : "border-b"} py-2`}
    >
      <span className={`col-span-3 md:col-span-2 num-marker ${labelColor}`}>— {label}</span>
      <div className="col-span-9 md:col-span-10">{children}</div>
    </div>
  );
}
