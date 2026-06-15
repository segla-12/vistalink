"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function SuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const slug = searchParams.get("slug");
  const publicUrl = searchParams.get("publicUrl");
  const editUrl = searchParams.get("editUrl");
  const qrCodeUrl = searchParams.get("qrCodeUrl");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 p-6">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur</h1>
          <p className="text-gray-700">Aucun projet trouvé ou erreur lors de la publication.</p>
          <Link href="/dashboard" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-500 transition">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 p-6">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-emerald-600 mb-4">Projet publié avec succès !</h1>
        <p className="text-gray-700 mb-6">Votre page est maintenant en ligne et prête à être partagée.</p>

        {publicUrl && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-500 mb-1">Lien public :</label>
            <div className="flex items-center justify-center gap-2">
              <input
                type="text"
                readOnly
                value={decodeURIComponent(publicUrl)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
              <button
                onClick={() => navigator.clipboard.writeText(decodeURIComponent(publicUrl))}
                className="p-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition"
                title="Copier le lien"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-4 3H9m10-4v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2h4a2 2 0 002-2v-2" /></svg>
              </button>
            </div>
            <Link href={decodeURIComponent(publicUrl)} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline mt-2 block">
              Ouvrir la page
            </Link>
          </div>
        )}

        {qrCodeUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-500 mb-1">QR Code :</label>
            <Image src={decodeURIComponent(qrCodeUrl)} alt="QR Code" width={150} height={150} className="mx-auto border border-gray-200 rounded-md" />
            <p className="text-xs text-gray-500 mt-2">Scannez pour partager facilement.</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {editUrl && (
            <Link href={decodeURIComponent(editUrl)} className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-500 transition">
              Modifier le projet
            </Link>
          )}
          <Link href="/dashboard" className="border border-gray-300 text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Chargement des détails de publication...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}