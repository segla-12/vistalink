"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PayPage({ params }: any) {
  const [catalog, setCatalog] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("catalogs")
        .select("*")
        .eq("edit_token", params.token)
        .single();

      setCatalog(data);
    };

    load();
  }, [params.token]);

  if (!catalog) return <p>Chargement...</p>;

  const paymentUrl =
    "https://pay.moneroo.io/plink_hmn4le2xyy5l?ref=" +
    catalog.edit_token +
    "&redirect_url=" +
    encodeURIComponent(
      "http://localhost:3000/payment-success?ref=" +
        catalog.edit_token
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <a
        href={paymentUrl}
        target="_blank"
        className="bg-green-600 px-6 py-3 rounded"
      >
        Payer 1000 FCFA
      </a>
    </div>
  );
}