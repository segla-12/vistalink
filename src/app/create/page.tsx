"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function CreatePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    description: "",
  });

  const createCatalog = async () => {
    setLoading(true);

    const editToken = uuidv4();

    const { data, error } = await supabase
      .from("catalogs")
      .insert({
        name: form.name,
        whatsapp: form.whatsapp,
        description: form.description,
        edit_token: editToken,
        is_paid: false,
      })
      .select()
      .single();

    setLoading(false);

    if (error || !data) {
      alert("Erreur lors de la création");
      return;
    }

    // redirection vers paiement
    router.push(`/pay/${editToken}`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">

      <div className="w-full max-w-md bg-slate-900 p-6 rounded-xl border border-slate-800">

        <h1 className="text-2xl font-bold mb-6">
          Créer ton catalogue
        </h1>

        <input
          placeholder="Nom du business"
          className="w-full p-3 mb-3 bg-slate-800 rounded"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="WhatsApp (229...)"
          className="w-full p-3 mb-3 bg-slate-800 rounded"
          value={form.whatsapp}
          onChange={(e) =>
            setForm({ ...form, whatsapp: e.target.value })
          }
        />

        <textarea
          placeholder="Description"
          className="w-full p-3 mb-3 bg-slate-800 rounded"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={createCatalog}
          disabled={loading}
          className="w-full bg-blue-600 py-3 rounded font-semibold"
        >
          {loading ? "Création..." : "Créer mon catalogue"}
        </button>

      </div>

    </main>
  );
}