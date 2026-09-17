import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/sobre", label: "Sobre" },
  { to: "/workshops", label: "Workshops" },
  { to: "/aulas", label: "Aulas" },
  { to: "/blog", label: "Agenda" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = () => {
      const d = new Date();
      const opts = { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Lisbon" };
      setTime(d.toLocaleTimeString("pt-PT", opts));
    };
    t();
    const id = setInterval(t, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-500 ${
        scrolled ? "bg-white border-black/10" : "bg-white md:bg-white/70 md:backdrop-blur border-black/10 md:border-transparent"
      }`}
    >
      <div className="grid grid-cols-12 items-center px-6 md:px-10 h-16">
        <Link
          to="/"
          data-testid="nav-logo"
          className="col-span-4 md:col-span-3 flex items-center gap-3 leading-none"
        >
          <img
            src="https://customer-assets-lxgj4vgw.emergentagent.net/job_art-showcase-dynamic/artifacts/rkz0tzpy_Design_sem_nome__1_-removebg-preview.png"
            alt="Atelier Galeria Ícone"
            className="h-10 md:h-12 w-auto object-contain"
          />
          <span className="sr-only">Atelier Galeria Ícone</span>
        </Link>

        <nav className="hidden md:flex col-span-6 justify-center gap-10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-testid={`nav-link-${l.label.toLowerCase()}`}
              className={({ isActive }) =>
                `text-[11px] tracking-[0.28em] uppercase font-medium link-underline ${
                  isActive ? "text-black" : "text-black/70 hover:text-black"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="col-span-8 md:col-span-3 flex items-center justify-end gap-6">
          <span className="hidden md:block text-[10px] tracking-[0.3em] uppercase text-black/70">
            Coimbra · {time}
          </span>
          <a
            href="#contacto"
            data-testid="nav-cta"
            className="hidden md:inline-block border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert"
          >
            Contacto
          </a>
          <button
            data-testid="nav-menu-toggle"
            className="md:hidden border border-black px-3 py-2 text-[10px] tracking-[0.28em] uppercase"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/10 bg-white">
          <div className="flex flex-col p-6 gap-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-${l.label.toLowerCase()}`}
                className="font-serif text-3xl leading-none"
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
