import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadFile } from "@/lib/upload";

const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i;

/**
 * Galeria editável de imagens/vídeos de um artigo — colar URL ou carregar
 * ficheiro directamente — com escolha de qual imagem é a capa. Só imagens
 * podem ser capa; ao remover a imagem que estava definida como capa, a
 * escolha é limpa também.
 */
export default function MediaManager({ media, onMediaChange, cover, onCoverChange }) {
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const addUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    onMediaChange([...media, url]);
    setUrlInput("");
  };

  const removeAt = (index) => {
    const url = media[index];
    onMediaChange(media.filter((_, i) => i !== index));
    if (url === cover) onCoverChange("");
  };

  const moveAt = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= media.length) return;
    const next = [...media];
    [next[index], next[target]] = [next[target], next[index]];
    onMediaChange(next);
  };

  const onFileSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const data = await uploadFile(file);
      onMediaChange([...media, data.url]);
      toast("Ficheiro carregado.");
    } catch (err) {
      toast(err?.response?.data?.detail || "Não foi possível carregar o ficheiro.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="media-manager">
      {media.length === 0 ? (
        <p className="text-sm text-black/40 italic font-serif">Sem imagens ou vídeos ainda.</p>
      ) : (
        <ul className="border-t border-black/20">
          {media.map((url, index) => {
            const isVideo = VIDEO_EXT.test(url);
            const isCover = url === cover;
            return (
              <li
                key={`${url}-${index}`}
                className={`flex items-center gap-3 border-b border-black/20 py-2 ${
                  isCover ? "bg-black/5" : ""
                }`}
                data-testid={`media-item-${index}`}
              >
                <span className="num-marker text-black/40 w-6 shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {isVideo ? (
                  <video src={url} className="w-16 h-10 object-cover bg-black/5 shrink-0" muted />
                ) : (
                  <img src={url} alt="" className="w-16 h-10 object-cover bg-black/5 shrink-0" />
                )}
                <span className="flex-1 text-xs text-black/60 truncate font-mono">{url}</span>
                {isVideo ? (
                  <span className="text-[10px] tracking-[0.2em] uppercase text-black/30 shrink-0">
                    Vídeo
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onCoverChange(isCover ? "" : url)}
                    data-testid={`media-cover-${index}`}
                    className={`border px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase shrink-0 ${
                      isCover
                        ? "border-black bg-black text-white"
                        : "border-black/30 hover-invert"
                    }`}
                  >
                    {isCover ? "Capa ✓" : "Usar como capa"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => moveAt(index, -1)}
                  disabled={index === 0}
                  className="px-2 text-black/50 hover:text-black disabled:opacity-20"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveAt(index, 1)}
                  disabled={index === media.length - 1}
                  className="px-2 text-black/50 hover:text-black disabled:opacity-20"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  data-testid={`media-remove-${index}`}
                  className="border border-black px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase hover-invert shrink-0"
                >
                  Remover
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          placeholder="Colar URL de imagem ou vídeo…"
          data-testid="media-url-input"
          className="flex-1 min-w-[16rem] bg-transparent outline-none py-2 text-sm border-b border-black/20 focus:border-black"
        />
        <button
          type="button"
          onClick={addUrl}
          data-testid="media-url-add"
          className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert"
        >
          Adicionar URL
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid="media-upload-button"
          className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert disabled:opacity-40"
        >
          {uploading ? "A carregar…" : "Carregar ficheiro"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={onFileSelected}
          data-testid="media-file-input"
        />
      </div>
    </div>
  );
}
