import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LOGOUT } from "@/constants/testIds";

const NAV_ITEMS = [
  { to: "/admin", label: "Painel", end: true },
  { to: "/admin/blog", label: "Blog" },
  { to: "/admin/workshops", label: "Workshops" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const onLogout = async () => {
    setLeaving(true);
    try {
      await logout();
      navigate("/admin/login", { replace: true });
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="min-h-screen-safe bg-white text-black" data-testid="admin-layout">
      <header className="border-b border-black px-6 md:px-10 py-5 flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-8">
          <Link to="/admin" className="num-marker" data-testid="admin-brand">
            Atelier Galeria Ícone — Painel
          </Link>
          <nav className="hidden md:flex items-baseline gap-6">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                data-testid={`admin-nav-${item.label.toLowerCase()}`}
                className={({ isActive }) =>
                  `num-marker link-underline ${isActive ? "text-black" : "text-black/50"}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-baseline gap-6">
          {user?.email && (
            <span className="hidden sm:inline num-marker text-black/50" data-testid="admin-user-email">
              {user.email}
            </span>
          )}
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="link-underline num-marker"
            data-testid="admin-view-site"
          >
            Ver site
          </Link>
          <button
            type="button"
            onClick={onLogout}
            disabled={leaving}
            data-testid={LOGOUT.button}
            className="border border-black px-5 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert disabled:opacity-40"
          >
            {leaving ? "A sair…" : "Sair"}
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
