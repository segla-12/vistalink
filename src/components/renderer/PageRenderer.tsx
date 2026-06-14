"use client";

import { useEffect } from "react";
import type { Block, Project } from "@/lib/blocks/types";
import { initBlockRegistry } from "@/lib/blocks/registry";
import BlockRenderer from "./BlockRenderer";

// ─── Initialiser le registre au premier appel ────────────
let registryInitialized = false;
function ensureRegistry() {
  if (!registryInitialized) {
    initBlockRegistry();
    registryInitialized = true;
  }
}

interface PageRendererProps {
  blocks: Block[];
  project?: Partial<Project>;
  previewBanner?: React.ReactNode;
}

export default function PageRenderer({ blocks, project, previewBanner }: PageRendererProps) {
  ensureRegistry();

  const sortedBlocks = [...blocks]
    .filter((b) => b.visible !== false)
    .sort((a, b) => a.order - b.order);

  return (
    <>
      {previewBanner}

      {/* Global project info injectée via styles */}
      {project?.globalStyles && (
        <style>{`
          .page-renderer {
            --primary: ${project.globalStyles.primaryColor || "#16A34A"};
            --bg: ${project.globalStyles.backgroundColor || "#ffffff"};
          }
        `}</style>
      )}

      <div className="page-renderer" style={{ backgroundColor: "var(--bg, #ffffff)" }}>
        {sortedBlocks.length === 0 && (
          <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-center p-8">
            <div>
              <div className="text-4xl mb-4">📄</div>
              <p className="text-lg font-medium">Cette page est vide</p>
              <p className="text-sm mt-2">Ajoutez des blocs depuis l'éditeur</p>
            </div>
          </div>
        )}

        {sortedBlocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>
    </>
  );
}