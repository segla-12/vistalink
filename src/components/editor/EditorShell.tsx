"use client";

import { useState, useCallback, useEffect } from "react";
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import type { Block, BlockType } from "@/lib/blocks/types";
import { getAllBlockMetas, getBlockMeta } from "@/lib/blocks/registry";
import PageRenderer from "@/components/renderer/PageRenderer";
import { motion, AnimatePresence } from "framer-motion";

// ─── Sous-composants ────────────────────────────────────
import BlockLibrary from "./BlockLibrary";
import SortableBlockItem from "./SortableBlockItem";
import BlockSettings from "./BlockSettings";
import DragOverlayBlock from "./DragOverlayBlock";

interface EditorShellProps {
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  projectName?: string;
}

export default function EditorShell({ initialBlocks = [], onSave, projectName = "Mon projet" }: EditorShellProps) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showLibrary, setShowLibrary] = useState(true);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // ─── Gestion des blocs ──────────────────────────────

  const addBlock = useCallback((type: BlockType) => {
    const meta = getBlockMeta(type);
    if (!meta) return;

    const newBlock: Block = {
      id: uuidv4(),
      type,
      content: JSON.parse(JSON.stringify(meta.defaultContent)),
      styles: JSON.parse(JSON.stringify(meta.defaultStyles)),
      order: blocks.length,
      visible: true,
    };

    setBlocks((prev) => [...prev, newBlock]);
    setSelectedBlockId(newBlock.id);
    setShowPreview(false);
  }, [blocks.length]);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  }, [selectedBlockId]);

  const duplicateBlock = useCallback((id: string) => {
    const block = blocks.find((b) => b.id === id);
    if (!block) return;
    const newBlock: Block = {
      ...JSON.parse(JSON.stringify(block)),
      id: uuidv4(),
      order: block.order + 1,
    };
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      const updated = [...prev];
      updated.splice(idx + 1, 0, newBlock);
      return updated.map((b, i) => ({ ...b, order: i }));
    });
    setSelectedBlockId(newBlock.id);
  }, [blocks]);

  const moveBlockUp = useCallback((id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx <= 0) return prev;
      const updated = [...prev];
      [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
      return updated.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const moveBlockDown = useCallback((id: string) => {
    setBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === id);
      if (idx >= prev.length - 1) return prev;
      const updated = [...prev];
      [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
      return updated.map((b, i) => ({ ...b, order: i }));
    });
  }, []);

  const toggleVisibility = useCallback((id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, visible: !b.visible } : b))
    );
  }, []);

  // ─── Drag & Drop ────────────────────────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id);
      const newIndex = prev.findIndex((b) => b.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;

      const updated = [...prev];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);
      return updated.map((b, i) => ({ ...b, order: i }));
    });
  };

  // ─── Sauvegarde auto ─────────────────────────────────
  useEffect(() => {
    if (blocks.length > 0) {
      const timeout = setTimeout(() => onSave?.(blocks), 2000);
      return () => clearTimeout(timeout);
    }
  }, [blocks, onSave]);

  const blockMetas = getAllBlockMetas();

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* ===== SIDEBAR GAUCHE : Projet + Outils ===== */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden">
        {/* En-tête */}
        <div className="p-5 border-b border-slate-800">
          <h2 className="text-sm font-bold text-emerald-400 tracking-wider uppercase">VistaLink</h2>
          <h3 className="text-lg font-semibold mt-1 truncate">{projectName}</h3>
        </div>

        {/* Boutons d'action */}
        <div className="p-4 space-y-2 border-b border-slate-800">
          <button
            onClick={() => setShowLibrary(!showLibrary)}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
              showLibrary ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {showLibrary ? "📦 Bibliothèque" : "📦 Blocs"}
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${
              showPreview ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            👁️ {showPreview ? "Éditeur" : "Aperçu"}
          </button>
        </div>

        {/* Bibliothèque de blocs */}
        {showLibrary && (
          <BlockLibrary
            blockMetas={blockMetas}
            onAddBlock={addBlock}
          />
        )}
      </aside>

      {/* ===== CANVAS CENTRAL ===== */}
      <main className="flex-1 overflow-y-auto bg-slate-950">
        {!showPreview ? (
          <div className="min-h-full">
            {/* Barre d'info */}
            <div className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 px-6 py-3 flex items-center justify-between">
              <span className="text-sm text-slate-400">
                <span className="font-semibold text-white">{blocks.length}</span> bloc{blocks.length > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => onSave?.(blocks)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow-lg"
              >
                💾 Sauvegarder
              </button>
            </div>

            {/* Zone de drop */}
            <div className="max-w-3xl mx-auto py-8 px-4">
              {blocks.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4">📄</div>
                  <p className="text-lg text-slate-400 font-medium">Votre page est vide</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Ajoutez des blocs depuis la bibliothèque à gauche
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={blocks.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {blocks
                        .sort((a, b) => a.order - b.order)
                        .map((block) => (
                          <SortableBlockItem
                            key={block.id}
                            block={block}
                            isSelected={selectedBlockId === block.id}
                            onSelect={() => setSelectedBlockId(block.id)}
                            onUpdate={(updates) => updateBlock(block.id, updates)}
                            onRemove={() => removeBlock(block.id)}
                            onDuplicate={() => duplicateBlock(block.id)}
                            onMoveUp={() => moveBlockUp(block.id)}
                            onMoveDown={() => moveBlockDown(block.id)}
                            onToggleVisibility={() => toggleVisibility(block.id)}
                          />
                        ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {activeId ? <DragOverlayBlock block={blocks.find((b) => b.id === activeId)} /> : null}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </div>
        ) : (
          /* Aperçu en plein écran */
          <div className="bg-white min-h-screen">
            <PageRenderer blocks={blocks} />
          </div>
        )}
      </main>

      {/* ===== SIDEBAR DROITE : Propriétés du bloc sélectionné ===== */}
      <AnimatePresence>
        {selectedBlock && showLibrary && (
          <motion.aside
            className="w-80 bg-slate-900 border-l border-slate-800 overflow-y-auto shrink-0"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <BlockSettings
              block={selectedBlock}
              onUpdate={(updates) => updateBlock(selectedBlock.id, updates)}
              onClose={() => setSelectedBlockId(null)}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}