"use client";

import type { Block } from "@/lib/blocks/types";
import { getBlockMeta } from "@/lib/blocks/registry";

interface DragOverlayBlockProps {
  block?: Block;
}

export default function DragOverlayBlock({ block }: DragOverlayBlockProps) {
  if (!block) return null;

  const meta = getBlockMeta(block.type);

  return (
    <div className="w-72 bg-slate-800 rounded-xl border-2 border-emerald-500 shadow-2xl shadow-emerald-500/20 p-4">
      <div className="flex items-center gap-3">
        <span className="text-xl">{meta?.icon || "📦"}</span>
        <div>
          <p className="text-sm font-semibold text-white">
            {block.content.title || meta?.label || block.type}
          </p>
          <p className="text-xs text-slate-400">{meta?.label || block.type}</p>
        </div>
      </div>
    </div>
  );
}