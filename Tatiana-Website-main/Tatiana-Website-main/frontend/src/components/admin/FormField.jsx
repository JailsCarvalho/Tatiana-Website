import React from "react";

/** Linha de formulário no estilo do site: rótulo à esquerda, campo à direita, traço em baixo. */
export function Field({ label, children, hint, wide = false, required = false }) {
  return (
    <div className="grid grid-cols-12 gap-4 border-b border-black py-4 items-start">
      <span className="col-span-12 md:col-span-3 num-marker text-black/60 pt-3">
        — {label}
        {required && <span aria-hidden="true"> *</span>}
      </span>
      <div className={`col-span-12 ${wide ? "md:col-span-9" : "md:col-span-6"}`}>
        {children}
        {hint && <p className="mt-2 text-xs leading-relaxed text-black/45">{hint}</p>}
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-transparent outline-none py-3 text-lg font-serif placeholder:text-black/30 border-b border-black/20 focus:border-black transition-colors";

export function TextInput(props) {
  return <input {...props} className={`${inputCls} ${props.className || ""}`} />;
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className={`${inputCls} resize-y leading-relaxed ${props.className || ""}`}
    />
  );
}

export function PublishedToggle({ value, onChange, testid }) {
  return (
    <button
      type="button"
      data-testid={testid}
      onClick={() => onChange(!value)}
      className={`border border-black px-5 py-2.5 text-[10px] tracking-[0.28em] uppercase transition-colors duration-300 ${
        value ? "bg-black text-white" : "hover-invert"
      }`}
    >
      {value ? "Publicado" : "Rascunho"}
    </button>
  );
}
