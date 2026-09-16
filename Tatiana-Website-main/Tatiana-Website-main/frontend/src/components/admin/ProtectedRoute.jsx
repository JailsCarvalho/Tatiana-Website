import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/** Deixa passar apenas quem tem sessão válida; o resto vai para o ecrã de entrada. */
export default function ProtectedRoute() {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div
        className="min-h-screen-safe flex items-center justify-center"
        data-testid="admin-session-loading"
      >
        <p className="num-marker text-black/50">— A verificar sessão</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
