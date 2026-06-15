import type { Block } from "@/lib/blocks/types";

// ─── Catégories de templates ─────────────────────────────
export type TemplateCategory =
  | "restaurant"
  | "commerce"
  | "photographe"
  | "coiffeur"
  | "graphiste"
  | "medecin"
  | "garage"
  | "styliste"
  | "immobilier"
  | "consultant"
  | "artisan"
  | "formation"
  | "portfolio";

// ─── Types de projets ────────────────────────────────────
export type TemplateProjectType =
  | "landing"
  | "catalogue"
  | "funnel"
  | "minisite"
  | "portfolio"
  | "reservation";

// ─── Variantes de blocs ──────────────────────────────────
export interface BlockVariant {
  id: string;
  name: string;
  blockType: string;
  preview?: string; // emoji ou description courte
  content: Record<string, any>;
  styles: Record<string, any>;
}

// ─── Thème global ────────────────────────────────────────
export interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string; // emoji
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    cardBg: string;
    cardBorder: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: string;
  shadows: string;
}

// ─── Template complet ────────────────────────────────────
export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  projectType: TemplateProjectType;
  preview: string; // emoji ou URL d'image
  tags: string[];
  blocks: Block[];
  recommendedTheme?: string;
}

// ─── Catégorie avec métadonnées ──────────────────────────
export interface CategoryMeta {
  id: TemplateCategory;
  name: string;
  icon: string;
  description: string;
}