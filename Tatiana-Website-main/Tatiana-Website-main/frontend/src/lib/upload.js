import api from "@/lib/api";

// 4MB — com margem clara sob o limite de 4.5MB por pedido que a Vercel impõe
// às funções serverless. Abaixo disto vai tudo num único pedido; acima,
// divide-se em partes (ver backend/storage.py para o porquê).
const CHUNK_SIZE = 4 * 1024 * 1024;

/**
 * Carrega um ficheiro para o backend, escolhendo automaticamente entre um
 * pedido único (ficheiros pequenos) ou em partes sequenciais (grandes —
 * sobretudo vídeo). Devolve { url, filename, size }.
 */
export async function uploadFile(file) {
  if (file.size <= CHUNK_SIZE) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await api.post("/admin/uploads", formData);
    return data;
  }

  const { data: session } = await api.post("/admin/uploads/multipart/start", {
    filename: file.name,
  });

  const parts = [];
  const totalParts = Math.ceil(file.size / CHUNK_SIZE);
  for (let i = 0; i < totalParts; i++) {
    const start = i * CHUNK_SIZE;
    const chunk = file.slice(start, start + CHUNK_SIZE);
    const formData = new FormData();
    formData.append("upload_id", session.upload_id);
    formData.append("key", session.key);
    formData.append("part_number", String(i + 1));
    formData.append("chunk", chunk, file.name);
    // Sequencial de propósito: no backend em desenvolvimento local, as
    // partes são anexadas a um ficheiro por ordem de chegada — em paralelo
    // corrompia o resultado.
    const { data: part } = await api.post("/admin/uploads/multipart/part", formData);
    parts.push(part);
  }

  const { data } = await api.post("/admin/uploads/multipart/complete", {
    upload_id: session.upload_id,
    key: session.key,
    parts,
  });
  return data;
}
