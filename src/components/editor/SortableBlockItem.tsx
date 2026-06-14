"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Block } from "@/lib/blocks/types";
import { getBlockMeta } from "@/lib/blocks/registry";

interface SortableBlockItemProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Block>) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
}

export default function SortableBlockItem({
  block,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
}: SortableBlockItemProps) {
  const meta = getBlockMeta(block.type);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : block.visible ? 1 : 0.5,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-xl border-2 transition-all ${
        isSelected
          ? "border-emerald-500 bg-slate-800/80 shadow-lg shadow-emerald-500/5"
          : "border-slate-700/50 bg-slate-850 hover:border-slate-600"
      } ${!block.visible ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      {/* Header du bloc */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/50">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6h2v2H8V6zm6 0h2v2h-2V6zM8 11h2v2H8v-2zm6 0h2v2h-2v-2zm-6 5h2v2H8v-2zm6 0h2v2h-2v-2z" />
          </svg>
        </button>

        {/* Icône + nom */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-base">{meta?.icon || "📦"}</span>
          <span className="text-sm font-medium text-slate-200 truncate">
            {block.content.title || meta?.label || block.type}
          </span>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title={block.visible ? "Masquer" : "Afficher"}
          >
            {block.visible ? (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
            )}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Monter"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Descendre"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Dupliquer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-1 rounded hover:bg-red-600/20 text-slate-400 hover:text-red-400 transition"
            title="Supprimer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>

      {/* Mini preview du contenu */}
      <div className="px-4 py-3">
        <div className="text-xs text-slate-500 space-y-1">
          {block.content.description && (
            <p className="line-clamp-1">{block.content.description}</p>
          )}
          {block.content.items && (
            <p className="text-emerald-400/70">
              {block.content.items.length} élément{block.content.items.length > 1 ? "s" : ""}
            </p>
          )}
          {block.content.buttonText && (
            <p className="text-blue-400/70">Bouton : {block.content.buttonText}</p>
          )}
          {block.content.image && (
            <p className="text-purple-400/70">📸 Image incluse</p>
          )}
          {block.content.stats && (
            <p className="text-amber-400/70">{block.content.stats.length} statistiques</p>
          )}
          {!block.content.description && !block.content.items && !block.content.buttonText && !block.content.image && !block.content.stats && (
            <p className="text-slate-600 italic">Cliquez pour modifier</p>
          )}
        </div>
      </div>
    </div>
  );
}