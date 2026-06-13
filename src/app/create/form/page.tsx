"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function CreateFormPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    description: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Données envoyées :", { type, ...form });

    alert("Catalogue généré (simulation) 🚀");
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-16">

      <h1 className="text-3xl font-bold text-center">
        Créer votre vitrine - {type}
      </h1>

      <p className="text-center text-slate-400 mt-2">
        Remplissez vos informations
      </p>

      <div className="max-w-xl mx-auto mt-10 space-y-4">

        <input
          name="name"
          placeholder="Nom de votre activité"
          value={form.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800"
        />

        <input
          name="whatsapp"
          placeholder="Numéro WhatsApp"
          value={form.whatsapp}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-slate-900 border border-slate-800 h-32"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Générer mon catalogue
        </button>

      </div>

    </main>
  );
}