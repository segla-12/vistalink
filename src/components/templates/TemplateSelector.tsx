"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { templates, categories, getTemplatesByCategory } from "@/lib/templates/catalog";
import type { Template, TemplateCategory } from "@/lib/templates/types";
import type { Block } from "@/lib/blocks/types";

interface TemplateSelectorProps {
  selectedCategory: string;
  selectedTemplate: string;
  onSelect: (template: Template) => void;
}

export default function TemplateSelector({
  selectedCategory,
  selectedTemplate,
  onSelect,
}: TemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Filtrer les templates par catégorie sélectionnée
  const filteredTemplates = selectedCategory
    ? getTemplatesByCategory(selectedCategory as TemplateCategory)
    : templates;

  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-2">Choisissez un template</h2>
      <p className="text-gray-500 mb-8">
        Sélectionnez un modèle pour démarrer. Vous pourrez tout personnaliser après.
      </p>

      {/* Grille de templates */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 group ${
              selectedTemplate === template.id
                ? "border-emerald-500 bg-emerald-50 shadow-md"
                : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{template.preview}</span>
                <div>
                  <h3 className="font-bold text-base">{template.name}</h3>
                  <p className="text-gray-400 text-xs">{template.description}</p>
                </div>
              </div>
              {selectedTemplate === template.id && (
                <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </div>

            {/* Preview des blocs */}
            <div className="flex flex-wrap gap-1.5">
              {template.blocks.slice(0, 6).map((block, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full font-medium"
                >
                  {getBlockLabel(block.type)}
                </span>
              ))}
              {template.blocks.length > 6 && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] rounded-full font-medium">
                  +{template.blocks.length - 6}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.map((tag) => (
                <span key={tag} className="text-[10px] text-gray-400">
                  #{tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* Option vide */}
      <button
        onClick={() => onSelect(null as any)}
        className={`w-full mt-4 p-4 rounded-2xl border-2 border-dashed transition-all duration-300 text-center ${
          !selectedTemplate
            ? "border-emerald-500 bg-emerald-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <p className="text-sm font-medium text-gray-500">
          ✨ Commencer avec une page vide
        </p>
      </button>
    </div>
  );
}

// ─── Helper labels ────────────────────────────────────────
function getBlockLabel(type: string): string {
  const labels: Record<string, string> = {
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
  return labels[type] || type;
}