"use client";

import type { Block } from "@/lib/blocks/types";

// ─── Types ───────────────────────────────────────────────
export interface LocalProject {
  id: string;
  name: string;
  edit_token: string;
  slug: string;
  type?: string;
  language?: string;
  category?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  blocks: Block[];
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  global_styles?: Record<string, string>;
}

// ─── Clé de stockage ─────────────────────────────────────
const STORAGE_KEY = "vistalink-local-projects";

// ─── Helpers ─────────────────────────────────────────────
function getAllProjects(): LocalProject[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("[local-db] Erreur de lecture localStorage:", e);
    return [];
  }
}

function saveAllProjects(projects: LocalProject[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("[local-db] Erreur d'écriture localStorage:", e);
  }
}

// ─── API publique ────────────────────────────────────────

export function createLocalProject(data: {
  name: string;
  edit_token: string;
  slug: string;
  type?: string;
  language?: string;
  category?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  blocks?: Block[];
}): LocalProject {
  const now = new Date().toISOString();
  const project: LocalProject = {
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: data.name,
    edit_token: data.edit_token,
    slug: data.slug,
    type: data.type || "catalogue",
    language: data.language || "fr",
    category: data.category || "",
    description: data.description || "",
    phone: data.phone || "",
    whatsapp: data.whatsapp || "",
    email: data.email || "",
    address: data.address || "",
    blocks: data.blocks || [],
    is_paid: false,
    created_at: now,
    updated_at: now,
    global_styles: {
      fontFamily: "Inter",
      primaryColor: "#16A34A",
      secondaryColor: "#64748B",
      accentColor: "#0EA5E9",
      backgroundColor: "#ffffff",
      textColor: "#0F172A",
    },
  };

  const projects = getAllProjects();
  projects.push(project);
  saveAllProjects(projects);

  console.log(`[local-db] Projet créé: "${project.name}" (${project.edit_token})`);
  return project;
}

export function getLocalProjectByToken(token: string): LocalProject | null {
  const projects = getAllProjects();
  return projects.find((p) => p.edit_token === token) || null;
}

export function getLocalProjectBySlug(slug: string): LocalProject | null {
  const projects = getAllProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export function updateLocalProject(
  token: string,
  updates: Partial<LocalProject>
): LocalProject | null {
  const projects = getAllProjects();
  const index = projects.findIndex((p) => p.edit_token === token);
  if (index === -1) return null;

  projects[index] = {
    ...projects[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  saveAllProjects(projects);

  console.log(`[local-db] Projet mis à jour: "${projects[index].name}" (${token})`);
  return projects[index];
}

export function deleteLocalProject(token: string): boolean {
  const projects = getAllProjects();
  const filtered = projects.filter((p) => p.edit_token !== token);
  if (filtered.length === projects.length) return false;
  saveAllProjects(filtered);
  console.log(`[local-db] Projet supprimé: ${token}`);
  return true;
}

export function getAllLocalProjects(): LocalProject[] {
  return getAllProjects().sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function markLocalProjectAsPaid(token: string): LocalProject | null {
  return updateLocalProject(token, { is_paid: true } as Partial<LocalProject>);
}

/**
 * Récupère un projet depuis Supabase ou localStorage
 * priorité: Supabase > localStorage
 */
export async function getProject(token: string): Promise<LocalProject | null> {
  // Essayer Supabase d'abord
  try {
    const res = await fetch(`/api/project?token=${token}`);
    if (res.ok) {
      const data = await res.json();
      if (data.project?.blocks) {
        return {
          id: data.project.id,
          name: data.project.name,
          edit_token: data.project.edit_token,
          slug: data.project.meta?.slug || data.project.slug,
          type: data.project.type,
          language: data.project.language,
          description: data.project.meta?.description || "",
          whatsapp: data.project.whatsapp,
          phone: data.project.phone,
          email: data.project.email,
          address: data.project.address,
          blocks: data.project.blocks,
          is_paid: data.project.is_paid,
          created_at: data.project.created_at,
          updated_at: data.project.updated_at,
          global_styles: data.project.globalStyles,
        };
      }
    }
  } catch (e) {
    // Supabase indisponible, fallback localStorage
  }

  // Fallback localStorage
  return getLocalProjectByToken(token);
}