"use client";

import { useState } from "react";
import type { Block } from "@/lib/blocks/types";
import { getBlockMeta } from "@/lib/blocks/registry";
import MediaPicker from "./MediaPicker";
import { socialPlatforms, detectPlatform, getPlatform } from "@/lib/social-platforms";

interface BlockSettingsProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onClose: () => void;
}

export default function BlockSettings({ block, onUpdate, onClose }: BlockSettingsProps) {
  const meta = getBlockMeta(block.type);
  const { content, styles } = block;

  const updateContent = (key: string, value: any) => {
    onUpdate({
      content: { ...block.content, [key]: value },
    });
  };

  const updateStyle = (key: string, value: any) => {
    onUpdate({
      styles: { ...block.styles, [key]: value },
    });
  };

  return (
    <div className="p-5">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta?.icon || "📦"}</span>
          <div>
            <h3 className="font-semibold text-sm text-gray-800">{meta?.label || block.type}</h3>
            <p className="text-xs text-gray-400 capitalize">{block.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* ───── TITRE ───── */}
        <FieldGroup label="Titre">
          <input
            type="text"
            value={content.title || ""}
            onChange={(e) => updateContent("title", e.target.value)}
            placeholder="Titre du bloc"
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </FieldGroup>

        {/* ───── SOUS-TITRE ───── */}
        {"subtitle" in content && (
          <FieldGroup label="Sous-titre">
            <input
              type="text"
              value={content.subtitle || ""}
              onChange={(e) => updateContent("subtitle", e.target.value)}
              placeholder="Sous-titre"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </FieldGroup>
        )}

        {/* ───── DESCRIPTION ───── */}
        {"description" in content && (
          <FieldGroup label="Description">
            <textarea
              value={content.description || ""}
              onChange={(e) => updateContent("description", e.target.value)}
              placeholder="Description..."
              rows={3}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </FieldGroup>
        )}

        {/* ───── TEXTE DU BOUTON ───── */}
        {"buttonText" in content && (
          <FieldGroup label="Texte du bouton">
            <input
              type="text"
              value={content.buttonText || ""}
              onChange={(e) => updateContent("buttonText", e.target.value)}
              placeholder="Texte du CTA"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </FieldGroup>
        )}

        {/* ───── URL DU BOUTON ───── */}
        {"buttonUrl" in content && (
          <FieldGroup label="Lien du bouton">
            <input
              type="text"
              value={content.buttonUrl || ""}
              onChange={(e) => updateContent("buttonUrl", e.target.value)}
              placeholder="https://..."
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </FieldGroup>
        )}

        {/* ───── COULEUR DU BOUTON ───── */}
        {"buttonColor" in content && (
          <FieldGroup label="Couleur du bouton">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={content.buttonColor || "#16A34A"}
                onChange={(e) => updateContent("buttonColor", e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-gray-50 border border-gray-200"
              />
              <span className="text-xs text-gray-500">{content.buttonColor || "#16A34A"}</span>
            </div>
          </FieldGroup>
        )}

        {/* ───── IMAGE ───── */}
        {"image" in content && (
          <MediaPicker
            label="Image"
            value={content.image || ""}
            onChange={(url) => updateContent("image", url)}
            type="image"
          />
        )}

        {/* ───── VIDÉO ───── */}
        {"video" in content && (
          <MediaPicker
            label="Vidéo"
            value={content.video || ""}
            onChange={(url) => updateContent("video", url)}
            type="video"
          />
        )}

        {/* ───── ARTICLES (items) ───── */}
        {"items" in content && content.items && (
          <FieldGroup label={`Éléments (${content.items.length})`}>
            <div className="space-y-3">
              {content.items.map((item, i) => (
                <div key={item.id || i} className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-1.5">
                  <input
                    type="text"
                    value={item.title || ""}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[i] = { ...newItems[i], title: e.target.value };
                      updateContent("items", newItems);
                    }}
                    placeholder="Titre"
                    className="w-full p-1.5 bg-white rounded text-xs text-gray-700 border border-gray-200"
                  />
                  <input
                    type="text"
                    value={item.description || ""}
                    onChange={(e) => {
                      const newItems = [...(content.items || [])];
                      newItems[i] = { ...newItems[i], description: e.target.value };
                      updateContent("items", newItems);
                    }}
                    placeholder="Description"
                    className="w-full p-1.5 bg-white rounded text-xs text-gray-700 border border-gray-200"
                  />
                  {item.price !== undefined && (
                    <input
                      type="text"
                      value={item.price || ""}
                      onChange={(e) => {
                        const newItems = [...(content.items || [])];
                        newItems[i] = { ...newItems[i], price: e.target.value };
                        updateContent("items", newItems);
                      }}
                      placeholder="Prix"
                      className="w-full p-1.5 bg-white rounded text-xs text-gray-700 border border-gray-200"
                    />
                  )}
                  {item.icon !== undefined && (
                    <input
                      type="text"
                      value={item.icon || ""}
                      onChange={(e) => {
                        const newItems = [...(content.items || [])];
                        newItems[i] = { ...newItems[i], icon: e.target.value };
                        updateContent("items", newItems);
                      }}
                      placeholder="Icône (emoji)"
                      className="w-full p-1.5 bg-white rounded text-xs text-gray-700 border border-gray-200"
                    />
                  )}
                  {"image" in item && (
                    <MediaPicker
                      label=""
                      value={item.image || ""}
                      onChange={(url) => {
                        const newItems = [...(content.items || [])];
                        newItems[i] = { ...newItems[i], image: url };
                        updateContent("items", newItems);
                      }}
                      type="image"
                      compact
                    />
                  )}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        const newItems = (content.items || []).filter((_, idx) => idx !== i);
                        updateContent("items", newItems);
                      }}
                      className="text-[10px] text-red-500 hover:text-red-600 transition"
                    >
                      ✕ Supprimer
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => {
                  const newItems = [...(content.items || []), { id: String(Date.now()), title: "", description: "" }];
                  updateContent("items", newItems);
                }}
                className="w-full py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition"
              >
                + Ajouter un élément
              </button>
            </div>
          </FieldGroup>
        )}

        {/* ───── STATISTIQUES ───── */}
        {"stats" in content && content.stats && (
          <FieldGroup label="Statistiques">
            <div className="space-y-2">
              {content.stats.map((stat, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...(content.stats || [])];
                      newStats[i] = { ...newStats[i], label: e.target.value };
                      updateContent("stats", newStats);
                    }}
                    placeholder="Label"
                    className="flex-1 p-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...(content.stats || [])];
                      newStats[i] = { ...newStats[i], value: e.target.value };
                      updateContent("stats", newStats);
                    }}
                    placeholder="Valeur"
                    className="flex-1 p-1.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-700"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const newStats = [...(content.stats || []), { label: "", value: "" }];
                  updateContent("stats", newStats);
                }}
                className="w-full py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition"
              >
                + Ajouter une statistique
              </button>
            </div>
          </FieldGroup>
        )}

        {/* ───── FAQ ───── */}
        {"faqItems" in content && content.faqItems && (
          <FieldGroup label="Questions fréquentes">
            <div className="space-y-2">
              {content.faqItems.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => {
                      const newItems = [...(content.faqItems || [])];
                      newItems[i] = { ...newItems[i], question: e.target.value };
                      updateContent("faqItems", newItems);
                    }}
                    placeholder="Question"
                    className="w-full p-1.5 bg-white rounded text-xs text-gray-700 border border-gray-200 mb-1.5"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => {
                      const newItems = [...(content.faqItems || [])];
                      newItems[i] = { ...newItems[i], answer: e.target.value };
                      updateContent("faqItems", newItems);
                    }}
                    placeholder="Réponse"
                    rows={2}
                    className="w-full p-1.5 bg-white rounded text-xs text-gray-700 resize-none border border-gray-200"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const newItems = [...(content.faqItems || []), { question: "", answer: "" }];
                  updateContent("faqItems", newItems);
                }}
                className="w-full py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition"
              >
                + Ajouter une question
              </button>
            </div>
          </FieldGroup>
        )}

        {/* ───── RÉSEAUX SOCIAUX ───── */}
        {"socialLinks" in content && (
          <FieldGroup label={`Réseaux sociaux (${(content.socialLinks || []).length})`}>
            <div className="space-y-2">
              {(content.socialLinks || []).map((link: any, i: number) => {
                const platform = getPlatform(link.platform);
                return (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={link.platform || ""}
                        onChange={(e) => {
                          const newLinks = [...(content.socialLinks || [])];
                          newLinks[i] = { ...newLinks[i], platform: e.target.value };
                          updateContent("socialLinks", newLinks);
                        }}
                        className="flex-1 p-1.5 bg-white rounded text-xs text-gray-700 border border-gray-200 focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="">Choisir...</option>
                        {socialPlatforms.filter(p => p.id !== "website").map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          const newLinks = (content.socialLinks || []).filter((_: any, idx: number) => idx !== i);
                          updateContent("socialLinks", newLinks);
                        }}
                        className="text-red-500 hover:text-red-600 text-[10px] transition"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="url"
                        value={link.url || ""}
                        onChange={(e) => {
                          const newLinks = [...(content.socialLinks || [])];
                          const detected = detectPlatform(e.target.value);
                          if (detected && !link.platform) {
                            newLinks[i] = { ...newLinks[i], url: e.target.value, platform: detected };
                          } else {
                            newLinks[i] = { ...newLinks[i], url: e.target.value };
                          }
                          updateContent("socialLinks", newLinks);
                        }}
                        placeholder="https://..."
                        className="w-full p-1.5 bg-white rounded text-xs text-gray-700 placeholder-gray-400 border border-gray-200"
                      />
                      {platform && (
                        <span
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50"
                          dangerouslySetInnerHTML={{ __html: platform.svg }}
                          style={{ color: platform.color }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  const newLinks = [...(content.socialLinks || []), { platform: "", url: "" }];
                  updateContent("socialLinks", newLinks);
                }}
                className="w-full py-2 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 hover:border-emerald-400 hover:text-emerald-500 transition"
              >
                + Ajouter un réseau
              </button>
            </div>
          </FieldGroup>
        )}

        {/* ───── STYLES / AVANCÉ ───── */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Styles</h4>

          <FieldGroup label="Padding">
            <input
              type="text"
              value={styles.padding || ""}
              onChange={(e) => updateStyle("padding", e.target.value)}
              placeholder="ex: 64px 24px"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </FieldGroup>

          <FieldGroup label="Couleur de fond">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={styles.backgroundColor || "#transparent"}
                onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-gray-50 border border-gray-200"
              />
              <span className="text-xs text-gray-500">{styles.backgroundColor || "transparent"}</span>
            </div>
          </FieldGroup>

          <FieldGroup label="Couleur du texte">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={styles.textColor || "#0F172A"}
                onChange={(e) => updateStyle("textColor", e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-gray-50 border border-gray-200"
              />
              <span className="text-xs text-gray-500">{styles.textColor || "#0F172A"}</span>
            </div>
          </FieldGroup>

          <FieldGroup label="Largeur max">
            <input
              type="text"
              value={styles.maxWidth || ""}
              onChange={(e) => updateStyle("maxWidth", e.target.value)}
              placeholder="ex: 800px"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </FieldGroup>

          <FieldGroup label="Bordure arrondie">
            <input
              type="text"
              value={styles.borderRadius || ""}
              onChange={(e) => updateStyle("borderRadius", e.target.value)}
              placeholder="ex: 16px"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}

// ─── Field Group Helper ──────────────────────────────────
function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}