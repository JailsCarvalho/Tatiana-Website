import axios from "axios";

// Instância única para o painel. `withCredentials` é obrigatório: a sessão vive
// num cookie httpOnly, que o browser só envia se o pedido o pedir explicitamente.
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  withCredentials: true,
});

// Se a sessão expirar a meio do uso (cookie caducado, login noutro separador),
// cada pedido às páginas do painel passa a devolver 401 silenciosamente — sem
// isto, o utilizador ficava preso num ecrã com "não foi possível guardar" sem
// perceber porquê. Navegação completa (não client-side) para remontar o
// AuthProvider do zero. Ignora-se na própria página de login, onde um 401 em
// /auth/me é o estado normal de "ainda não autenticado", não uma sessão perdida.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isExpiredSession =
      error.response?.status === 401 && window.location.pathname !== "/admin/login";
    if (isExpiredSession) {
      window.location.assign("/admin/login");
    }
    return Promise.reject(error);
  },
);

export default api;
