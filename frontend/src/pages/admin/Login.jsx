import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { LOGIN } from "@/constants/testIds";

export default function Login() {
  const { user, checking, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setError("");
  };

  if (!checking && user) {
    return <Navigate to={location.state?.from || "/admin"} replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.email.trim() || !form.password) {
      setError("Preencha o email e a password.");
      return;
    }

    setLoading(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(location.state?.from || "/admin", { replace: true });
    } catch (err) {
      const status = err?.response?.status;
      setError(
        status === 401
          ? "Email ou password incorrectos."
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen-safe bg-white text-black flex items-center justify-center px-6 py-20"
      data-testid="page-admin-login"
    >
      <title>Entrar · Painel Atelier Galeria Ícone</title>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="w-full max-w-md"
      >
        <p className="num-marker text-black/60">— Área reservada</p>
        <h1 className="mt-5 display text-5xl md:text-6xl leading-[0.9]">
          Painel <span className="italic">do atelier</span>
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-black/60">
          Aqui gere o blog, os workshops e as aulas do site.
        </p>

        <form onSubmit={onSubmit} className="mt-12 border-t border-black" noValidate>
          <Field label="Email">
            <input
              data-testid={LOGIN.emailInput}
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={update("email")}
              placeholder="voce@dominio.pt"
              className="w-full bg-transparent outline-none py-4 text-lg font-serif placeholder:text-black/30"
            />
          </Field>
          <Field label="Password">
            <input
              data-testid={LOGIN.passwordInput}
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              className="w-full bg-transparent outline-none py-4 text-lg font-serif placeholder:text-black/30"
            />
          </Field>

          {error && (
            <p
              className="mt-6 border border-black px-4 py-3 num-marker leading-relaxed"
              data-testid="login-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            data-testid={LOGIN.submitButton}
            type="submit"
            disabled={loading}
            className="mt-8 w-full border border-black px-10 py-4 text-[11px] tracking-[0.32em] uppercase hover-invert disabled:opacity-40"
          >
            {loading ? "A entrar…" : "Entrar"}
          </button>
        </form>

        <p className="mt-10 text-xs leading-relaxed text-black/50">
          Esqueceu-se da password? O acesso é reposto por quem mantém o site —
          não existe recuperação automática.
        </p>
      </motion.div>
    </main>
  );
}

// col-span-4 e não 3: com o tracking de 0.28em do num-marker, "— PASSWORD" não
// cabe em 3 colunas desta largura e partia em duas linhas.
function Field({ label, children }) {
  return (
    <label className="grid grid-cols-12 items-baseline gap-4 border-b border-black py-2 cursor-text">
      <span className="col-span-4 num-marker text-black/60 whitespace-nowrap">— {label}</span>
      <span className="col-span-8">{children}</span>
    </label>
  );
}
