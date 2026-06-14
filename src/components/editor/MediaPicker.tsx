"use client";

import { useState, useRef, useCallback } from "react";
import { uploadImage } from "@/lib/upload";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  type?: "image" | "video";
  label?: string;
  compact?: boolean;
}

type InputMode = "upload" | "url" | "library";

// ─── Extraction d'URL vidéo depuis les plateformes ────────
function extractVideoEmbed(url: string): string | null {
  if (!url) return null;

  // YouTube
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  // TikTok - on ne peut pas embed directement, on retourne l'URL
  // Facebook Video
  const fbMatch = url.match(/facebook\.com\/.*\/videos\/(\d+)/);
  if (fbMatch) return url;

  return null;
}

export default function MediaPicker({
  value,
  onChange,
  type = "image",
  label,
  compact = false,
}: MediaPickerProps) {
  const [mode, setMode] = useState<InputMode>("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState<string[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // ─── Upload de fichier ────────────────────────────────
  const handleFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const url = await uploadImage(file);
        onChange(url);
      } catch (err: any) {
        setError(err.message || "Erreur lors de l'upload");
      }
      setUploading(false);
    },
    [onChange]
  );

  // ─── Drag & Drop ──────────────────────────────────────
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith(type === "video" ? "video/" : "image/")) {
        handleFile(file);
      } else {
        setError("Format non supporté");
      }
    },
    [handleFile, type]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  // ─── URL externe ──────────────────────────────────────
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;
    let finalUrl = urlInput.trim();

    // Si c'est une vidéo YouTube/Vimeo, on embed
    if (type === "video") {
      const embed = extractVideoEmbed(finalUrl);
      if (embed) finalUrl = embed;
    }

    onChange(finalUrl);
    setUrlInput("");
  };

  // ─── Charger la médiathèque ───────────────────────────
  const loadLibrary = async () => {
    setLoadingLibrary(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setLibraryImages(data.urls || []);
      }
    } catch {}
    setLoadingLibrary(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium text-slate-400">{label}</label>
      )}

      {/* Zone principale de drop / aperçu */}
      {value ? (
        <div className="relative group">
          {type === "video" && value.includes("youtube.com/embed") ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-slate-700">
              <iframe
                src={value}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-32 object-cover rounded-lg border border-slate-700"
            />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={() => {
                onChange("");
                setUrlInput("");
              }}
              className="bg-red-500 hover:bg-red-400 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              ✕ Supprimer
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-500 hover:bg-blue-400 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
            >
              ↻ Remplacer
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-slate-600 hover:border-slate-500 bg-slate-800/50"
          }`}
        >
          {uploading ? (
            <div className="py-2">
              <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">Upload en cours...</p>
            </div>
          ) : (
            <>
              <div className="text-2xl mb-1">{type === "video" ? "🎬" : "🖼️"}</div>
              <p className="text-xs text-slate-400 font-medium">
                {dragOver ? "Déposez ici" : "Cliquez ou glissez-déposez"}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {type === "video" ? "MP4, MOV, WebM" : "JPG, PNG, WebP, GIF"}
              </p>
            </>
          )}
        </div>
      )}

      {/* Inputs cachés */}
      <input
        ref={fileInputRef}
        type="file"
        accept={type === "video" ? "video/*" : "image/*"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept={type === "video" ? "video/*" : "image/*"}
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {/* Boutons d'action rapide */}
      {!value && (
        <div className="flex gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] text-slate-300 transition flex items-center justify-center gap-1"
          >
            📁 Galerie
          </button>
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-[11px] text-slate-300 transition flex items-center justify-center gap-1"
          >
            📷 Photo
          </button>
          <button
            onClick={() => setMode(mode === "url" ? "upload" : "url")}
            className={`flex-1 py-1.5 px-2 border rounded-lg text-[11px] transition flex items-center justify-center gap-1 ${
              mode === "url"
                ? "bg-emerald-600 border-emerald-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
          >
            🔗 URL
          </button>
        </div>
      )}

      {/* Champ URL */}
      {mode === "url" && !value && (
        <div className="flex gap-1.5">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
            placeholder={type === "video" ? "URL YouTube, Vimeo..." : "https://..."}
            className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            onClick={handleUrlSubmit}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
          >
            ✓
          </button>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="text-[10px] text-red-400">{error}</p>
      )}
    </div>
  );
}