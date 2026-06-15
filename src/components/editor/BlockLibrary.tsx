"use client";

import { useState } from "react";
import type { BlockMeta, BlockType } from "@/lib/blocks/types";

interface BlockLibraryProps {
  blockMetas: BlockMeta[];
  onAddBlock: (type: BlockType) => void;
}

type CategoryKey = "all" | "content" | "media" | "social" | "conversion" | "structure";

const CATEGORIES: { key: CategoryKey; label: string; icon: string }[] = [
  { key: "all", label: "Tous", icon: "📋" },
  { key: "content", label: "Contenu", icon: "📝" },
  { key: "media", label: "Média", icon: "🖼️" },
  { key: "social", label: "Social", icon: "👥" },
  { key: "conversion", label: "Conversion", icon: "🎯" },
  { key: "structure", label: "Structure", icon: "🏗️" },
];

export default function BlockLibrary({ blockMetas, onAddBlock }: BlockLibraryProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = blockMetas.filter((meta) => {
    if (activeCategory !== "all" && meta.category !== activeCategory) return false;
    if (searchQuery && !meta.label.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {/* Search */}
      <input
        type="text"
        placeholder="Rechercher un élément..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
      />

      {/* Catégories */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeCategory === cat.key
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Grille d'éléments */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((meta) => (
          <button
            key={meta.type}
            onClick={() => onAddBlock(meta.type)}
            className="flex flex-col items-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group cursor-pointer"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{meta.icon}</span>
            <span className="text-xs text-gray-600 font-medium text-center leading-tight">{meta.label}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-8">
          Aucun élément trouvé
        </p>
      )}
    </div>
  );
}