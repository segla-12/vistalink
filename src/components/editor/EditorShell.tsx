"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import type { Block, BlockType } from "@/lib/blocks/types";
import { getAllBlockMetas, getBlockMeta } from "@/lib/blocks/registry";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import BlockLibrary from "./BlockLibrary";
import SortableBlockItem from "./SortableBlockItem";
import BlockSettings from "./BlockSettings";
import DragOverlayBlock from "./DragOverlayBlock";

import { templates, categories } from "@/lib/templates/catalog";
import type { TemplateCategory } from "@/lib/templates/types";
import { importHTML, saveImportedTemplate, getImportedTemplates, suggestedTemplates } from "@/lib/templates/importer";

type SidebarTab = "elements" | "pages" | "settings" | "templates" | "import";

interface EditorShellProps {
  initialBlocks?: Block[];
  onSave?: (blocks: Block[]) => void;
  projectName?: string;
  editToken?: string;
}

type DeviceType = "mobile" | "tablet" | "desktop";

const DEVICE_CONFIG: Record<DeviceType, { width: number; height: number; label: string; frame: string }> = {
  mobile: { width: 375, height: 812, label: "Mobile 375px", frame: "iPhone / Android" },
  tablet: { width: 768, height: 1024, label: "Tablette 768px", frame: "Tablette" },
  desktop: { width: 1440, height: 900, label: "Desktop 1440px", frame: "Desktop" },
};

// --- Types pour les pages ---
interface Page {
  id: string;
  name: string;
  blocks: Block[];
  isHome?: boolean;
}

// --- Notification ---
interface Notification {
  id: string;
  type: "success" | "error" | "loading";
  message: string;
}

// --- Helpers ---
function sendBlocksToIframe(iframe: HTMLIFrameElement | null, blocks: Block[]) {
  if (!iframe?.contentWindow) return;
  try {
    iframe.contentWindow.postMessage(
      { type: "preview:update", blocks },
      window.location.origin
    );
  } catch (e) {
    // Silently fail
  }
}

let notifCounter = 0;

export default function EditorShell({
  initialBlocks = [],
  onSave,
  projectName = "Mon projet",
  editToken,
}: EditorShellProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (initialBlocks.length === 0 && templates.length > 0) {
      const first = templates[0];
      return first.blocks.map((b, i) => ({ ...b, id: uuidv4(), order: i, visible: true }));
    }
    return initialBlocks;
  });
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<DeviceType>("desktop");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("elements");
  const [templateCategory, setTemplateCategory] = useState<TemplateCategory | "all">("all");
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pages, setPages] = useState<Page[]>(() => [
    { id: "home", name: "Page d'accueil", blocks: [], isHome: true },
    { id: "about", name: "À propos", blocks: [] },
    { id: "contact", name: "Contact", blocks: [] },
  ]);
  const [activePageId, setActivePageId] = useState<string>("home");
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [newPageName, setNewPageName] = useState("");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blocksRef = useRef(blocks);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  // --- Notifications ---
  const addNotification = useCallback((type: Notification["type"], message: string) => {
    const id = `notif-${++notifCounter}`;
    setNotifications((prev) => [...prev, { id, type, message }]);
    // Auto-suppression après 4s (sauf loading)
    if (type !== "loading") {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    }
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // --- Pages ---
  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  // Charge les blocs de la page active
  useEffect(() => {
    if (activePage && activePage.blocks.length > 0 && blocks.length === 0) {
      setBlocks(activePage.blocks);
    }
  }, [activePageId]);

  // Synchronise les blocs modifiés avec la page active
  useEffect(() => {
    if (activePageId) {
      setPages((prev) =>
        prev.map((p) => (p.id === activePageId ? { ...p, blocks } : p))
      );
    }
  }, [blocks, activePageId]);

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId) || null;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // --- Preview sync ---
  const syncPreview = useCallback((newBlocks: Block[]) => {
    sessionStorage.setItem("preview_blocks", JSON.stringify(newBlocks));
    const iframe = iframeRef.current;
    if (iframe) {
      sendBlocksToIframe(iframe, newBlocks);
    }
  }, []);

  useEffect(() => {
    if (showPreview) {
      syncPreview(blocks);
    }
  }, [blocks, showPreview, syncPreview]);

  // --- Sauvegarde ---
  const handleSave = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    const loadingId = addNotification("loading", "Sauvegarde en cours...");

    try {
      console.log("[EditorShell] Sauvegarde déclenchée");
      console.log("[EditorShell] Blocs à sauvegarder:", blocks.length, "blocs");

      if (editToken) {
        const res = await fetch("/api/project", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            edit_token: editToken,
            blocks,
          }),
        });

        const data = await res.json();
        console.log("[EditorShell] Réponse API save:", data);

        if (!res.ok) {
          throw new Error(data.error || `Erreur ${res.status}`);
        }
      }

      // Appeler le callback onSave si fourni
      if (onSave) {
        onSave(blocks);
      }

      removeNotification(loadingId);
      addNotification("success", "Projet sauvegardé ✅");
    } catch (err: any) {
      console.error("[EditorShell] Erreur sauvegarde:", err.message);
      removeNotification(loadingId);
      addNotification("error", `Erreur : ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [blocks, editToken, isLoading, onSave, addNotification, removeNotification]);

  // --- Publication ---
  const handlePublish = useCallback(async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    const loadingId = addNotification("loading", "Publication en cours...");

    try {
      console.log("[EditorShell] Publication déclenchée");

      // D'abord sauvegarder les blocs
      if (editToken) {
        const saveRes = await fetch("/api/project", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            edit_token: editToken,
            blocks,
          }),
        });

        const saveData = await saveRes.json();
        console.log("[EditorShell] Sauvegarde avant publication:", saveData);

        if (!saveRes.ok) {
          throw new Error(saveData.error || `Erreur sauvegarde ${saveRes.status}`);
        }

        // Puis marquer comme payé/publik
        await fetch("/api/project", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            edit_token: editToken,
            // On pourrait ajouter un champ is_published ici
          }),
        });
      }

      removeNotification(loadingId);
      addNotification("success", "Projet publié avec succès 🚀");
      console.log("[EditorShell] Publication réussie");
    } catch (err: any) {
      console.error("[EditorShell] Erreur publication:", err.message);
      removeNotification(loadingId);
      addNotification("error", `Erreur de publication : ${err.message}`);
    } finally {
      setIsPublishing(false);
    }
  }, [blocks, editToken, isPublishing, addNotification, removeNotification]);

  // --- Gestion des pages ---
  const switchPage = useCallback(
    (pageId: string) => {
      // Sauvegarder les blocs actuels dans la page courante
      setPages((prev) =>
        prev.map((p) => (p.id === activePageId ? { ...p, blocks } : p))
      );
      setActivePageId(pageId);
      setSelectedBlockId(null);
      const targetPage = pages.find((p) => p.id === pageId);
      if (targetPage) {
        setBlocks(targetPage.blocks);
      }
      console.log(`[EditorShell] Page changée: ${pageId}`);
    },
    [activePageId, blocks, pages]
  );

  const addPage = useCallback(() => {
    const name = newPageName.trim() || `Page ${pages.length + 1}`;
    const newPage: Page = {
      id: `page-${uuidv4().slice(0, 8)}`,
      name,
      blocks: [],
    };
    setPages((prev) => [...prev, newPage]);
    setActivePageId(newPage.id);
    setBlocks([]);
    setNewPageName("");
    setEditingPageId(null);
    console.log(`[EditorShell] Nouvelle page créée: "${name}" (${newPage.id})`);
    addNotification("success", `Page "${name}" créée ✅`);
  }, [newPageName, pages.length, addNotification]);

  const renamePage = useCallback((pageId: string, newName: string) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, name: newName } : p))
    );
    setEditingPageId(null);
    console.log(`[EditorShell] Page renommée: ${pageId} -> "${newName}"`);
  }, []);

  const deletePage = useCallback(
    (pageId: string) => {
      if (pageId === "home") return; // Ne pas supprimer la page d'accueil
      const page = pages.find((p) => p.id === pageId);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      if (activePageId === pageId) {
        const firstRemaining = pages.find((p) => p.id !== pageId);
        if (firstRemaining) {
          setActivePageId(firstRemaining.id);
          setBlocks(firstRemaining.blocks);
        }
      }
      console.log(`[EditorShell] Page supprimée: "${page?.name}" (${pageId})`);
      addNotification("success", `Page supprimée 🗑️`);
    },
    [pages, activePageId, addNotification]
  );

  // --- Blocs (add/update/remove/duplicate/move/toggle) ---
  const addBlock = useCallback(
    (type: BlockType) => {
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
      console.log(`[EditorShell] Bloc ajouté: ${type} (${newBlock.id})`);
    },
    [blocks.length]
  );

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
    console.log(`[EditorShell] Bloc supprimé: ${id}`);
  }, [selectedBlockId]);

  const duplicateBlock = useCallback(
    (id: string) => {
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
    },
    [blocks]
  );

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

  // --- Templates ---
  const applyTemplate = useCallback(
    (templateId: string) => {
      const template = templates.find((t) => t.id === templateId);
      if (!template) return;
      const newBlocks = template.blocks.map((b, i) => ({
        ...b,
        id: uuidv4(),
        order: i,
        visible: true,
      }));
      setBlocksAndSync(newBlocks, templateId);
      setSelectedBlockId(null);
      setSidebarTab("elements");
      console.log(`[EditorShell] Template appliqué: "${template.name}" (${templateId})`);
      addNotification("success", `Template "${template.name}" appliqué ✅`);
    },
    [addNotification]
  );

  const setBlocksAndSync = useCallback(
    (newBlocks: Block[], templateId?: string | null) => {
      setBlocks(newBlocks);
      if (templateId !== undefined) {
        setActiveTemplateId(templateId);
      }
    },
    []
  );

  // --- Drag & Drop ---
  const handleDragStart = (event: DragStartEvent) =>
    setActiveId(event.active.id as string);

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

  // --- Import suggéré ---
  const handleImportTemplate = useCallback(
    async (tpl: { name: string; url: string; description: string }) => {
      setIsLoading(true);
      const loadingId = addNotification("loading", `Import de "${tpl.name}"...`);
      console.log(`[EditorShell] Import template: ${tpl.name} (${tpl.url})`);

      try {
        const res = await fetch(
          `/api/fetch-template?url=${encodeURIComponent(tpl.url)}`
        );
        const data = await res.json();
        console.log("[EditorShell] Réponse API fetch-template:", res.status, data);

        if (!res.ok) {
          throw new Error(data.error || `Erreur ${res.status}`);
        }

        if (data.html) {
          const imported = importHTML(data.html);
          console.log(
            `[EditorShell] HTML importé: ${data.html.length} caractères, ${imported.length} blocs générés`
          );
          setBlocksAndSync(imported, null);
          saveImportedTemplate({
            name: tpl.name,
            url: tpl.url,
            description: tpl.description,
            blocks: imported,
          });
          setSidebarTab("elements");
          removeNotification(loadingId);
          addNotification("success", `Template "${tpl.name}" importé ✅`);
        } else {
          throw new Error("Aucun HTML retourné par l'API");
        }
      } catch (err: any) {
        console.error("[EditorShell] Erreur import template:", err.message);
        removeNotification(loadingId);
        addNotification(
          "error",
          `Import échoué : ${err.message}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addNotification, removeNotification]
  );

  // --- Auto-save et load initial ---
  useEffect(() => {
    if (blocks.length > 0) {
      const timeout = setTimeout(() => onSave?.(blocks), 2000);
      return () => clearTimeout(timeout);
    }
  }, [blocks, onSave]);

  // --- Rendu ---
  const blockMetas = getAllBlockMetas();
  const filteredTemplates =
    templateCategory === "all"
      ? templates
      : templates.filter((t) => t.category === templateCategory);

  const blockLabels: Record<string, string> = {
    hero: "Hero",
    text: "Texte",
    products: "Produits",
    gallery: "Galerie",
    testimonials: "Avis",
    cta: "CTA",
    footer: "Footer",
    services: "Services",
    features: "Features",
    about: "À propos",
    stats: "Stats",
    contact: "Contact",
    social: "Social",
    pricing: "Tarifs",
    faq: "FAQ",
    team: "Équipe",
    logos: "Logos",
    image: "Image",
    video: "Vidéo",
    form: "Formulaire",
    header: "Header",
  };

  const tabs: { id: SidebarTab; label: string }[] = [
    { id: "elements", label: "Éléments" },
    { id: "templates", label: "Templates" },
    { id: "import", label: "Importer" },
    { id: "pages", label: "Pages" },
  ];

  const handleTogglePreview = useCallback(() => {
    setShowPreview((prev) => {
      if (!prev) {
        sessionStorage.setItem("preview_blocks", JSON.stringify(blocksRef.current));
      }
      return !prev;
    });
  }, []);

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      sendBlocksToIframe(iframe, blocksRef.current);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-900 overflow-hidden">
      {/* Notifications flottantes */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition-all duration-300 ${
              n.type === "success"
                ? "bg-emerald-600 text-white"
                : n.type === "error"
                ? "bg-red-600 text-white"
                : "bg-gray-800 text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              {n.type === "loading" && (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              {n.type === "success" && <span>✅</span>}
              {n.type === "error" && <span>❌</span>}
              {n.message}
            </div>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/vistalink-logo.png"
              alt="Vistalink"
              className="h-8 w-8 rounded-lg object-contain shadow-sm"
            />
            <span className="font-bold text-sm tracking-tight text-gray-800">VistaLink</span>
          </Link>
          <div className="h-6 w-px bg-gray-200" />
          <span className="text-sm text-gray-500 truncate max-w-[200px]">{projectName}</span>
        </div>
        <div className="flex items-center gap-2">
          {showPreview && (
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 border border-gray-200">
              {(["mobile", "tablet", "desktop"] as DeviceType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setPreviewDevice(d)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                    previewDevice === d
                      ? "bg-white shadow-sm text-gray-800"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {d === "desktop" ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ) : d === "tablet" ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  )}
                  <span className="hidden sm:inline">{DEVICE_CONFIG[d].label}</span>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={handleTogglePreview}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition border ${
              showPreview
                ? "bg-blue-50 text-blue-600 border-blue-200"
                : "text-gray-600 hover:bg-gray-100 border-gray-200"
            }`}
          >
            {showPreview ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Éditer
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Aperçu
              </>
            )}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-2">
            {blocks.length} bloc{blocks.length > 1 ? "s" : ""}
          </span>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition border flex items-center gap-2 ${
              isLoading
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200"
            }`}
          >
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Sauvegarder
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm flex items-center gap-2 ${
              isPublishing
                ? "bg-emerald-400 text-white cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {isPublishing && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            Publier
          </button>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar gauche */}
        <aside className="w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSidebarTab(tab.id)}
                className={`flex-1 py-3 text-xs font-semibold transition ${
                  sidebarTab === tab.id
                    ? "text-emerald-600 border-b-2 border-emerald-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto">
            {sidebarTab === "elements" && (
              <BlockLibrary blockMetas={blockMetas} onAddBlock={addBlock} />
            )}

            {/* Onglet Templates */}
            {sidebarTab === "templates" && (
              <div className="p-4">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <button
                    onClick={() => setTemplateCategory("all")}
                    className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition ${
                      templateCategory === "all"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    Tous
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTemplateCategory(cat.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition ${
                        templateCategory === cat.id
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  {filteredTemplates.map((template) => {
                    const isActive = activeTemplateId === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => applyTemplate(template.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all group ${
                          isActive
                            ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/30"
                            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{template.preview}</span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isActive ? "text-emerald-700" : "text-gray-800"
                              }`}
                            >
                              {template.name}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {template.description}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              isActive
                                ? "bg-emerald-600 text-white"
                                : "bg-emerald-100 text-emerald-700 opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            {isActive ? "Actif" : "Appliquer"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {template.blocks.slice(0, 5).map((b, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-gray-100 rounded text-[9px] text-gray-500"
                            >
                              {blockLabels[b.type] || b.type}
                            </span>
                          ))}
                          {template.blocks.length > 5 && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 rounded text-[9px] text-emerald-600">
                              +{template.blocks.length - 5}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Onglet Import */}
            {sidebarTab === "import" && (
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  📥 Importer un template
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Importez le HTML d'un template externe pour le convertir en blocs
                  Vistalink.
                </p>
                <div className="mb-4">
                  <label className="text-xs text-gray-500 block mb-1.5">
                    Coller le code HTML
                  </label>
                  <textarea
                    id="import-html-textarea"
                    rows={6}
                    placeholder="Collez le code HTML de votre template ici..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 placeholder-gray-400 resize-none font-mono"
                  />
                  <button
                    onClick={() => {
                      const textarea = document.getElementById(
                        "import-html-textarea"
                      ) as HTMLTextAreaElement;
                      if (!textarea?.value.trim()) {
                        addNotification("error", "Collez d'abord du code HTML");
                        return;
                      }
                      console.log(
                        "[EditorShell] Import HTML manuel:",
                        textarea.value.length,
                        "caractères"
                      );
                      const imported = importHTML(textarea.value);
                      console.log("[EditorShell] Blocs générés:", imported.length);
                      setBlocksAndSync(imported, null);
                      setSidebarTab("elements");
                      addNotification("success", "HTML importé avec succès ✅");
                    }}
                    className="mt-2 w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500 transition"
                  >
                    🔄 Convertir en blocs
                  </button>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    🌐 Templates suggérés
                  </h4>
                  <p className="text-xs text-gray-400 mb-3">
                    Cliquez sur un template pour le télécharger et l'importer
                    automatiquement.
                  </p>
                  <div className="space-y-2">
                    {suggestedTemplates.slice(0, 6).map((tpl) => (
                      <button
                        key={tpl.url}
                        onClick={() => handleImportTemplate(tpl)}
                        disabled={isLoading}
                        className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group disabled:opacity-50 disabled:cursor-wait"
                      >
                        <p className="text-xs font-semibold text-gray-700">{tpl.name}</p>
                        <p className="text-[10px] text-gray-400">{tpl.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
                {getImportedTemplates().length > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                      📂 Mes imports
                    </h4>
                    <div className="space-y-2">
                      {getImportedTemplates().map((tpl) => (
                        <button
                          key={tpl.id}
                          onClick={() => {
                            setBlocksAndSync(tpl.blocks, null);
                            setSidebarTab("elements");
                            console.log(
                              `[EditorShell] Template importé chargé: "${tpl.name}"`
                            );
                          }}
                          className="w-full text-left p-2.5 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                        >
                          <p className="text-xs font-semibold text-gray-700">
                            {tpl.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(tpl.importedAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Onglet Pages */}
            {sidebarTab === "pages" && (
              <div className="p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Pages du site
                </h3>
                <div className="space-y-1">
                  {pages.map((p) => (
                    <div key={p.id} className="flex items-center gap-1">
                      {editingPageId === p.id ? (
                        <div className="flex-1 flex gap-1">
                          <input
                            type="text"
                            defaultValue={p.name}
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                renamePage(p.id, e.currentTarget.value);
                              }
                              if (e.key === "Escape") {
                                setEditingPageId(null);
                              }
                            }}
                            onBlur={(e) => renamePage(p.id, e.target.value)}
                            className="flex-1 px-2 py-1.5 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => switchPage(p.id)}
                          className={`flex-1 text-left px-2.5 py-2 rounded-lg text-sm transition ${
                            activePageId === p.id
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {p.isHome ? "🏠" : "📄"} {p.name}
                        </button>
                      )}
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => setEditingPageId(p.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                          title="Renommer"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        {!p.isHome && (
                          <button
                            onClick={() => deletePage(p.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition"
                            title="Supprimer"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ajouter une page */}
                <div className="mt-3 flex gap-1">
                  <input
                    type="text"
                    value={newPageName}
                    onChange={(e) => setNewPageName(e.target.value)}
                    placeholder="Nom de la page..."
                    className="flex-1 px-2.5 py-2 text-sm border border-dashed border-gray-300 rounded-lg bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-emerald-50/30 transition"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addPage();
                    }}
                  />
                  <button
                    onClick={addPage}
                    className="px-3 py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition whitespace-nowrap"
                  >
                    + Ajouter
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Zone principale */}
        <main className="flex-1 overflow-y-auto bg-gray-100">
          {!showPreview ? (
            <div className="min-h-full py-8 px-4">
              <div className="max-w-3xl mx-auto">
                {blocks.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <p className="text-lg text-gray-600 font-medium">
                      {activePage?.name || "Commencez à créer"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Choisissez un template ou ajoutez des éléments depuis le panneau de
                      gauche
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
                      {activeId ? (
                        <DragOverlayBlock
                          block={blocks.find((b) => b.id === activeId)}
                        />
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </div>
            </div>
          ) : (
            <div className="min-h-full bg-gray-200 flex flex-col items-center justify-start gap-4 overflow-auto py-8 px-4">
              <div
                className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 shrink-0"
                style={{
                  width: `${DEVICE_CONFIG[previewDevice].width}px`,
                }}
              >
                {previewDevice === "desktop" && (
                  <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                    <div className="ml-4 flex-1 max-w-md mx-auto">
                      <div className="bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center border border-gray-200">
                        apercu.vistalink.app
                      </div>
                    </div>
                  </div>
                )}
                {previewDevice === "mobile" && (
                  <div className="bg-gray-900 h-7 flex items-center justify-center relative">
                    <div className="w-24 h-1.5 bg-gray-700 rounded-full" />
                  </div>
                )}
                {previewDevice === "tablet" && (
                  <div className="bg-gray-900 h-7 flex items-center justify-center">
                    <div className="w-16 h-1.5 bg-gray-700 rounded-full" />
                  </div>
                )}
                <div
                  className="relative"
                  style={{
                    width: "100%",
                    height: `${DEVICE_CONFIG[previewDevice].height}px`,
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    src="/preview"
                    className="absolute inset-0 w-full h-full"
                    title="Aperçu responsive"
                    style={{ border: "none" }}
                    sandbox="allow-scripts allow-same-origin"
                    onLoad={handleIframeLoad}
                  />
                </div>
                {previewDevice === "mobile" && (
                  <div className="bg-gray-900 h-7 flex items-center justify-center gap-1">
                    <div className="w-8 h-1 bg-gray-700 rounded-full" />
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {DEVICE_CONFIG[previewDevice].label} — viewport réel {DEVICE_CONFIG[previewDevice].width}px, sans zoom visuel
              </div>
            </div>
          )}
        </main>

        {/* Panneau de réglages (droite) */}
        <AnimatePresence>
          {selectedBlock && !showPreview && (
            <motion.aside
              className="w-80 bg-white border-l border-gray-200 overflow-y-auto shrink-0"
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
    </div>
  );
}