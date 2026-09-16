import axios from "axios";

// Instância única para o painel. `withCredentials` é obrigatório: a sessão vive
// num cookie httpOnly, que o browser só envia se o pedido o pedir explicitamente.
const api = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
  withCredentials: true,
});

export default api;
