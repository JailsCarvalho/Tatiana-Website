import React from "react";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

/** Raiz de todas as rotas /admin — fornece o contexto de sessão e mantém o painel fora dos motores de busca. */
export default function AdminRoot() {
  return (
    <AuthProvider>
      <meta name="robots" content="noindex, nofollow" />
      <Outlet />
    </AuthProvider>
  );
}
