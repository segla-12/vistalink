"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { initBlockRegistry } from "@/lib/blocks/registry";
import type { Block } from "@/lib/blocks/types";
import EditorShell from "@/components/editor/EditorShell";
import { getLocalProjectByToken, updateLocalProject } from "@/lib/local-db";

// ─── Initialiser le registre une fois ───────────────────
let registryReady = false;
function ensureRegistry() {
  if (!registryReady) {
    initBlockRegistry();
    registryReady = true;
  }
}

export default function EditPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [projectName, setProjectName] = useState("Mon projet");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isPaid, setIsPaid] = useState(false); // Nouveau state pour le statut de paiement
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Résoudre le token
  useEffect(() => {
    const resolve = async () => {
      const { token } = await params;
      setToken(token);
    };
    resolve();
  }, [params]);

  // Charger le projet
  useEffect(() => {
    if (!token) return;
    ensureRegistry();

    const load = async () => {
      try {
        // 1. Essayer Supabase via l'API
        const res = await fetch(`/api/project?token=${token}`);
        if (res.ok) {
          const data = await res.json();
          if (data.project?.blocks) {
            setBlocks(data.project.blocks);
            setProjectName(data.project.name || "Mon projet");
            setIsPaid(data.project.is_paid || false); // Récupérer le statut de paiement
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn("[edit] Supabase indisponible, fallback localStorage");
      }

      // 2. Fallback localStorage
      const localProject = getLocalProjectByToken(token);
      if (localProject) {
        setBlocks(localProject.blocks || []);
        setProjectName(localProject.name || "Mon projet");
        setIsPaid(localProject.is_paid || false); // Récupérer le statut de paiement local
        setLoading(false);
        return;
      }

      // 3. Projet introuvable
      setError("Projet introuvable");
      setLoading(false);
    };

    load();
  }, [token]);

  // Sauvegarder (local + Supabase)
  const handleSave = useCallback(async (newBlocks: Block[]) => {
    if (!token) return;

    // 1. Toujours sauvegarder en local
    updateLocalProject(token, { blocks: newBlocks });

    // 2. Essayer Supabase
    try {
      await fetch("/api/project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edit_token: token,
          blocks: newBlocks,
        }),
      });
    } catch (err) {
      console.warn("[edit] Sauvegarde Supabase échouée, local ok");
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold mb-2">Projet introuvable</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push("/create")}
            className="bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-500 transition shadow-lg"
          >
            Créer un nouveau projet
          </button>
        </div>
      </div>
    );
  }

  return (
    <EditorShell
      initialBlocks={blocks}
      onSave={handleSave}
      projectName={projectName}
      editToken={token}
      isPaid={isPaid} // Passer le statut de paiement à EditorShell
    />
  );
}