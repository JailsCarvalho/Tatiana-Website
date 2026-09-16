import React from "react";
import { Link } from "react-router-dom";

const LOGO_URL =
  "https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/rkz0tzpy_Design_sem_nome__1_-removebg-preview.png";

const schedule = [
  ["Segunda", "14h30 — 16h30"],
  ["Terça", "10h — 13h · 14h30 — 16h30"],
  ["Quarta", "10h — 13h · 14h30 — 16h30"],
  ["Quinta", "14h30 — 19h00"],
  ["Sexta", "14h30 — 19h00"],
  ["Sábado", "11h00 — 13h00"],
  ["Domingo", "Encerrado"],
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      id="contacto"
      className="bg-black text-white border-t border-black"
    >
      {/* Schedule + directions */}
      <div className="border-t border-white/20">
        <div className="grid grid-cols-12 gap-6 md:gap-10 px-6 md:px-10 py-16 md:py-20">
          {/* Horário */}
          <div className="col-span-12 md:col-span-6" data-testid="footer-schedule">
            <p className="num-marker mb-6 text-white/70">— Horário</p>
            <ul className="border-t border-white/20">
              {schedule.map(([day, hours]) => (
                <li
                  key={day}
                  className="grid grid-cols-12 gap-4 border-b border-white/20 py-3 md:py-4 items-baseline"
                >
                  <span className="col-span-4 md:col-span-3 font-serif text-lg md:text-2xl">
                    {day}
                  </span>
                  <span className="col-span-8 md:col-span-9 num-marker text-white/80 md:text-right">
                    {hours}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-white/50 leading-relaxed max-w-md">
              Aulas mediante marcação. Fora do horário indicado, contacte-nos por
              telefone ou email.
            </p>
          </div>

          {/* Contactos */}
          <div className="col-span-12 md:col-span-5 md:col-start-8" data-testid="footer-contacts">
            <p className="num-marker mb-6 text-white/70">— Contactos</p>
            <div className="border-t border-white/20 divide-y divide-white/20">
              <div className="py-4">
                <p className="num-marker text-white/50 mb-2">Endereço</p>
                <a
                  href="https://maps.google.com/?q=P%C3%A1tio+Inquisi%C3%A7%C3%A3o+23%2C+Coimbra"
                  target="_blank"
                  rel="noreferrer"
                  className="font-serif text-2xl md:text-3xl link-underline inline-block"
                >
                  Pátio Inquisição 23<br />
                  3000-021 Coimbra
                </a>
              </div>
              <div className="py-4">
                <p className="num-marker text-white/50 mb-2">Telefone</p>
                <a
                  href="tel:+351967311015"
                  className="font-serif text-2xl md:text-3xl link-underline inline-block"
                  data-testid="footer-phone"
                >
                  +351 967 311 015
                </a>
              </div>
              <div className="py-4">
                <p className="num-marker text-white/50 mb-2">Email</p>
                <a
                  href="mailto:galeriaicone@gmail.com"
                  className="font-serif text-2xl md:text-3xl link-underline inline-block"
                  data-testid="footer-email"
                >
                  galeriaicone@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand + navigation */}
      <div className="border-t border-white/20">
        <div className="grid grid-cols-12 gap-6 px-6 md:px-10 py-10">
          <div className="col-span-12 md:col-span-4">
            <Link to="/" className="inline-block">
              <img
                src={LOGO_URL}
                alt="Galeria-Atelier Ícone"
                className="h-24 md:h-28 w-auto object-contain invert"
              />
            </Link>
            <p className="mt-4 text-xs tracking-[0.2em] uppercase text-white/60">
              Espaço de ensino artístico · Coimbra
            </p>
          </div>
          <div className="col-span-6 md:col-span-3 md:col-start-6">
            <p className="num-marker mb-4 text-white/70">— Direções</p>
            <ul className="space-y-2 text-sm">
              <li><Link className="link-underline" to="/">Índice</Link></li>
              <li><Link className="link-underline" to="/sobre">Sobre</Link></li>
              <li><Link className="link-underline" to="/workshops">Workshops</Link></li>
              <li><Link className="link-underline" to="/aulas">Aulas</Link></li>
              <li><Link className="link-underline" to="/blog">Diário</Link></li>
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <p className="num-marker mb-4 text-white/70">— Redes</p>
            <ul className="space-y-2 text-sm">
              <li><a className="link-underline" href="https://www.instagram.com/galeriaateliericone/" target="_blank" rel="noreferrer" data-testid="footer-instagram-link">Instagram</a></li>
              <li><a className="link-underline" href="https://www.facebook.com/GaleriaAtelierIcone/" target="_blank" rel="noreferrer" data-testid="footer-facebook-link">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 px-6 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between text-[10px] tracking-[0.28em] uppercase text-white/70">
          <span>© {year} Galeria-Atelier Ícone — Todos os direitos reservados</span>
          <span className="mt-3 md:mt-0">Coimbra · Web por Emergent</span>
        </div>
      </div>
    </footer>
  );
}
