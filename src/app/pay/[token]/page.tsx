"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function PayPage() {
  const params = useParams();
  const token = params.token as string;

  const [catalog, setCatalog] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("catalogs")
        .select("*")
        .eq("edit_token", token)
        .single();

      setCatalog(data);
    };

    if (token) load();
  }, [token]);

  if (!catalog) return <p className="min-h-screen flex items-center justify-center bg-black text-white">Chargement...</p>;

  const slug = catalog.slug;
  const redirectUrl = slug
    ? "http://localhost:3000/payment-success?ref=" + token + "&slug=" + slug
    : "http://localhost:3000/payment-success?ref=" + token;

  const paymentUrl =
    "https://pay.moneroo.io/plink_hmn4le2xyy5l?ref=" +
    token +
    "&redirect_url=" +
    encodeURIComponent(redirectUrl);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white gap-6">
      <h1 className="text-2xl font-bold">Paiement</h1>
      <p className="text-slate-400">Débloquez votre catalogue pour 1000 FCFA / mois</p>

      {/* Résumé du catalogue */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold">{catalog.name}</h2>
        {catalog.description && (
          <p className="text-slate-400 text-sm mt-1">{catalog.description}</p>
        )}
        {catalog.whatsapp && (
          <p className="text-slate-500 text-sm mt-2">📱 {catalog.whatsapp}</p>
        )}
      </div>

      <a
        href={paymentUrl}
        target="_blank"
        className="bg-green-600 px-6 py-3 rounded font-semibold hover:bg-green-700 transition"
      >
        Payer 1000 FCFA
      </a>

      <p className="text-slate-500 text-sm">
        🔒 Paiement sécurisé via Moneroo
      </p>
    </div>
  );
}
