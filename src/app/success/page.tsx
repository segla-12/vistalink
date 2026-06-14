"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import Link from "next/link";
import { toPng } from "html-to-image";

function SuccessContent() {
  const params = useSearchParams();

  const slug = params.get("slug");
  const token = params.get("token");

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const publicUrl = slug ? `${origin}/${slug}` : "";
  const editUrl = token ? `${origin}/edit/${token}` : "";

  const downloadQR = async () => {
    const node = document.getElementById("qrcode");

    if (!node) return;

    try {
      const dataUrl = await toPng(node);

      const link = document.createElement("a");
      link.download = `${slug || "catalogue"}-qrcode.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Erreur téléchargement QR :", error);
    }
  };

  const copyLink = async () => {
    if (!publicUrl) return;

    try {
      await navigator.clipboard.writeText(publicUrl);
      alert("Lien copié !");
    } catch {
      alert("Impossible de copier le lien.");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-md w-full text-center">

      <h1 className="text-2xl font-bold">
        🎉 Catalogue créé avec succès
      </h1>

      {/* Lien public */}
      <div className="mt-6">
        <p className="text-slate-400">Lien public</p>

        <a
          href={publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 break-all"
        >
          {publicUrl}
        </a>

        <button
          onClick={copyLink}
          className="mt-3 w-full bg-slate-800 py-2 rounded"
        >
          Copier le lien
        </button>
      </div>

      {/* Lien admin */}
      <div className="mt-4">
        <p className="text-slate-400">Lien admin</p>

        <a
          href={editUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 break-all"
        >
          {editUrl}
        </a>
      </div>

      {/* QR CODE */}
      <div className="mt-8 flex justify-center">
        {publicUrl && (
          <div
            id="qrcode"
            className="bg-white p-4 rounded-lg"
          >
            <QRCode
              value={publicUrl}
              size={180}
            />
          </div>
        )}
      </div>

      {/* Télécharger QR */}
      <button
        onClick={downloadQR}
        className="mt-4 w-full bg-green-600 py-3 rounded font-semibold"
      >
        Télécharger le QR Code
      </button>

      {/* Continuer édition */}
      <Link
        href={editUrl}
        className="mt-4 inline-block w-full bg-blue-600 py-3 rounded font-semibold"
      >
        Continuer l'édition
      </Link>

    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <Suspense fallback={<p className="text-slate-400">Chargement...</p>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}