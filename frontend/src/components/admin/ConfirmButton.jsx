import React, { useState } from "react";

/**
 * Botão de apagar com confirmação em dois cliques — evita o `window.confirm()`
 * nativo, que destoa do resto do design do site.
 */
export default function ConfirmButton({
  onConfirm,
  children = "Apagar",
  confirmLabel = "Confirmar?",
  className = "",
  testid,
  disabled = false,
}) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setConfirming(false);
    onConfirm();
  };

  return (
    <button
      type="button"
      data-testid={testid}
      onClick={handleClick}
      onBlur={() => setConfirming(false)}
      disabled={disabled}
      className={`border px-4 py-2 text-[10px] tracking-[0.28em] uppercase transition-colors duration-300 disabled:opacity-40 ${
        confirming ? "bg-black text-white border-black" : "border-black hover-invert"
      } ${className}`}
    >
      {confirming ? confirmLabel : children}
    </button>
  );
}
