import React, { useRef, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

const VIDEO_EXT = /\.(mp4|webm|mov)(\?|$)/i;

/** Um único ficheiro (imagem ou vídeo) carregado directamente — sem campo de URL. */
export default function MediaUploader({ value, onChange, testid = "media-uploader" }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const onFileSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post("/admin/uploads", formData);
      onChange(data.url);
      toast("Ficheiro carregado.");
    } catch (err) {
      toast(err?.response?.data?.detail || "Não foi possível carregar o ficheiro.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid={testid}>
      {value ? (
        <div className="flex flex-wrap items-center gap-4">
          {VIDEO_EXT.test(value) ? (
            <video src={value} className="w-28 h-20 object-cover border border-black/20" muted />
          ) : (
            <img src={value} alt="" className="w-28 h-20 object-cover border border-black/20" />
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              data-testid={`${testid}-replace`}
              className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert disabled:opacity-40"
            >
              {uploading ? "A carregar…" : "Substituir"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              data-testid={`${testid}-remove`}
              className="border border-black px-4 py-2 text-[10px] tracking-[0.28em] uppercase hover-invert"
            >
              Remover
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          data-testid={`${testid}-upload`}
          className="border border-black px-5 py-3 text-[10px] tracking-[0.28em] uppercase hover-invert disabled:opacity-40"
        >
          {uploading ? "A carregar…" : "Carregar imagem ou vídeo"}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={onFileSelected}
        data-testid={`${testid}-file-input`}
      />
    </div>
  );
}
