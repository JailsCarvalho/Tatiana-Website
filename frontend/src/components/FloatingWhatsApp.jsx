import React from "react";

const WHATSAPP_URL = "https://wa.me/351967311015";
const WHATSAPP_ICON_URL =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/yby9oa8x_whatsapp.png";

export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar pelo WhatsApp"
      title="Contactar pelo WhatsApp"
      data-testid="floating-whatsapp-button"
      className="fixed bottom-5 right-5 z-40 block h-14 w-14 transition-transform duration-300 hover:scale-105 md:bottom-8 md:right-8"
    >
      <img
        src={WHATSAPP_ICON_URL}
        alt=""
        aria-hidden="true"
        data-testid="floating-whatsapp-icon"
        className="block h-full w-full object-contain"
      />
      <span className="sr-only">WhatsApp</span>
    </a>
  );
}