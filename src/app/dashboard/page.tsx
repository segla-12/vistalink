"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllLocalProjects, deleteLocalProject } from "@/lib/local-db";
import type { LocalProject } from "@/lib/local-db";

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<LocalProject[]>([]);
  const [search, setSearch] = useState("");

  // Charger les projets
  useEffect(() => {
    setProjects(getAllLocalProjects());
  }, []);

  const refresh = () => {
    setProjects(getAllLocalProjects());
  };

  const handleDelete = (token: string, name: string) => {
    if (confirm(`Supprimer le projet "${name}" ? Cette action est irréversible.`)) {
      deleteLocalProject(token);
      refresh();
    }
  };

  const filtered = search
    ? projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : projects;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-lg tracking-tight">Vistalink</span>
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <h1 className="font-semibold text-gray-700">Mes projets</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/create"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-500 transition shadow-sm"
            >
              + Nouveau projet
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats + recherche */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm text-gray-500">
              {projects.length} projet{projects.length > 1 ? "s" : ""} au total
            </p>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet..."
            className="w-full sm:w-72 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📂</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              {search ? "Aucun résultat" : "Aucun projet"}
            </h2>
            <p className="text-gray-500 mb-6">
              {search
                ? `Aucun projet ne correspond à "${search}"`
                : "Créez votre premier projet pour commencer"}
            </p>
            <Link
              href="/create"
              className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-500 transition shadow-sm"
            >
              Créer un projet
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((project) => (
              <div
                key={project.edit_token}
                className="bg-white rounded-2xl border border-gray-200 hover:border-emerald-200 hover:shadow-md transition-all duration-300 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900 truncate">
                        {project.name}
                      </h3>
                      {project.is_paid ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-semibold shrink-0">
                          ✅ Publié
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-semibold shrink-0">
                          💳 En attente
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      {project.type && (
                        <span>📁 {project.type}</span>
                      )}
                      {project.category && (
                        <span>🏷️ {project.category}</span>
                      )}
                      {project.blocks && (
                        <span>🧱 {project.blocks.length} bloc{project.blocks.length > 1 ? "s" : ""}</span>
                      )}
                      <span>
                        📅 {new Date(project.updated_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-500 mt-2 truncate">
                        {project.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/edit/${project.edit_token}`}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition border border-gray-200"
                    >
                      ✏️ Modifier
                    </Link>
                    <Link
                      href={`/${project.slug}`}
                      target="_blank"
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition border ${
                        project.is_paid
                          ? "bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-600"
                          : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed pointer-events-none"
                      }`}
                    >
                      🔗 Voir
                    </Link>
                    {!project.is_paid && (
                      <Link
                        href={`/pay/${project.edit_token}`}
                        className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-100 transition border border-amber-200"
                      >
                        💳 Payer
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(project.edit_token, project.name)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}