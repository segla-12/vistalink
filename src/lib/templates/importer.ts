import type { Block } from "@/lib/blocks/types";
import { v4 as uuidv4 } from "uuid";

// ─── Parser HTML -> Blocs Vistalink ─────────────────────

/**
 * Détecte le type de bloc à partir de classes/balises HTML
 */
function detectBlockType(element: Element): string | null {
  const classes = element.className?.toLowerCase() || "";
  const tag = element.tagName?.toLowerCase() || "";
  const id = element.id?.toLowerCase() || "";
  const text = element.textContent?.toLowerCase().slice(0, 100) || "";

  const patterns: [RegExp, string][] = [
    [/hero|banner|accueil|header-hero|jumbotron/, "hero"],
    [/gallery|galerie|portfolio|grid-images/, "gallery"],
    [/product|produit|catalog|catalogue|card-grid/, "products"],
    [/service|offre|prestation/, "services"],
    [/testimonial|avis|temoignage|review|client/, "testimonials"],
    [/cta|call-to-action|action|banner-cta/, "cta"],
    [/footer|pied-page|bottom/, "footer"],
    [/contact|form|formulaire/, "contact"],
    [/faq|question|accordion/, "faq"],
    [/feature|fonctionnalite|carte/, "features"],
    [/about|a-propos|about-us/, "about"],
    [/team|equipe|staff|membre/, "team"],
    [/pricing|tarif|price|offre/, "pricing"],
    [/stats|statistique|chiffre|counter/, "stats"],
    [/header|navbar|nav|menu/, "header"],
    [/social|reseaux|follow/, "social"],
    [/video/, "video"],
    [/map|carte/, "map"],
    [/logo|partenaire|client/, "logos"],
  ];

  for (const [regex, type] of patterns) {
    if (regex.test(classes) || regex.test(id)) return type;
  }

  // Fallback sur les balises
  if (tag === "header" && !id.includes("footer")) return "hero";
  if (tag === "footer") return "footer";
  if (tag === "form") return "contact";
  if (tag === "nav") return "header";

  return null;
}

/**
 * Extrait le texte d'un élément en ignorant les balises de style/script
 */
function cleanText(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll("script, style, svg, path").forEach((s) => s.remove());
  return clone.textContent?.trim().replace(/\s+/g, " ").slice(0, 200) || "";
}

/**
 * Importe du HTML et le convertit en blocs Vistalink
 */
export function importHTML(html: string): Block[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const blocks: Block[] = [];
  let order = 0;

  // Parcourir les sections principales
  const sections = doc.body.querySelectorAll(
    "section, div.section, .container > div, main > *, body > *"
  );

  sections.forEach((el) => {
    const detectedType = detectBlockType(el);
    const titleEl = el.querySelector("h1, h2, h3, h4, .title, .heading");
    const subtitleEl = el.querySelector("h5, h6, .subtitle, .sub-heading");
    const descEl = el.querySelector("p:not(:has(> a)), .description, .text, .content");
    const btnEl = el.querySelector("a[class*='btn'], a[class*='button'], button");
    const title = titleEl ? cleanText(titleEl) : "";
    const subtitle = subtitleEl ? cleanText(subtitleEl) : "";
    const description = descEl ? cleanText(descEl) : "";
    const buttonText = btnEl ? cleanText(btnEl) : "";

    if (detectedType) {
      const block: Block = {
        id: uuidv4(),
        type: detectedType as any,
        content: { title, subtitle, description, buttonText, buttonUrl: "#" },
        styles: {
          padding: "64px 24px",
          backgroundColor: getComputedStyle(el).backgroundColor || "#ffffff",
          textColor: getComputedStyle(el).color || "#0F172A",
        },
        order,
        visible: true,
      };

      // Essayer de détecter plus de contenu
      const images = el.querySelectorAll("img");
      if (images.length > 0 && "image" in block.content) {
        block.content.image = (images[0] as HTMLImageElement).src || "";
      }

      const items = el.querySelectorAll("[class*='item'], [class*='card'], [class*='product'], li");
      if (items.length > 1) {
        block.content.items = Array.from(items).slice(0, 6).map((item, i) => {
          const itemTitleEl = item.querySelector("h3, h4, .title, .name");
          const itemDescEl = item.querySelector("p, .desc, .description");
          const itemPriceEl = item.querySelector(".price, .prix");
          const itemImg = item.querySelector("img");
          const itemIconEl = item.querySelector(".icon, .emoji");
          return {
            id: String(i),
            title: itemTitleEl ? cleanText(itemTitleEl) : `Élément ${i + 1}`,
            description: itemDescEl ? cleanText(itemDescEl) : "",
            price: itemPriceEl ? cleanText(itemPriceEl) : "",
            image: (itemImg as HTMLImageElement)?.src || "",
            icon: itemIconEl ? cleanText(itemIconEl) : "",
          };
        });
      }

      blocks.push(block);
      order++;
    }
  });

  // Si aucun bloc détecté, créer un bloc texte par défaut
  if (blocks.length === 0) {
    blocks.push({
      id: uuidv4(),
      type: "text",
      content: {
        title: cleanText(doc.body) || "Contenu importé",
        description: "Ce contenu a été importé depuis un template externe.",
      },
      styles: { padding: "64px 24px", backgroundColor: "#ffffff", textColor: "#0F172A" },
      order: 0,
      visible: true,
    });
  }

  return blocks;
}

// ─── Sauvegarde de template externe ────────────────────

export interface ExternalTemplate {
  id: string;
  name: string;
  url: string;
  description: string;
  screenshot?: string;
  importedAt: string;
  blocks: Block[];
}

/**
 * Enregistre un template importé dans le localStorage
 */
export function saveImportedTemplate(template: Omit<ExternalTemplate, "id" | "importedAt">) {
  const stored = localStorage.getItem("vistalink-imported-templates");
  const templates: ExternalTemplate[] = stored ? JSON.parse(stored) : [];
  templates.push({
    ...template,
    id: `imported-${Date.now()}`,
    importedAt: new Date().toISOString(),
  });
  localStorage.setItem("vistalink-imported-templates", JSON.stringify(templates));
  return templates;
}

/**
 * Récupère tous les templates importés
 */
export function getImportedTemplates(): ExternalTemplate[] {
  const stored = localStorage.getItem("vistalink-imported-templates");
  return stored ? JSON.parse(stored) : [];
}

/**
 * Supprime un template importé
 */
export function removeImportedTemplate(id: string) {
  const stored = localStorage.getItem("vistalink-imported-templates");
  if (!stored) return;
  const templates: ExternalTemplate[] = JSON.parse(stored);
  const filtered = templates.filter((t) => t.id !== id);
  localStorage.setItem("vistalink-imported-templates", JSON.stringify(filtered));
}

// ─── Catégories de l'import ────────────────────────────

/**
 * Suggestions de templates externes à importer
 */
export const suggestedTemplates = [
  {
    name: "HTML5 UP - Massively",
    url: "https://html5up.net/massively",
    description: "Template magazine/portfolio",
  },
  {
    name: "HTML5 UP - Editorial",
    url: "https://html5up.net/editorial",
    description: "Template éditorial professionnel",
  },
  {
    name: "HTML5 UP - Landed",
    url: "https://html5up.net/landed",
    description: "Landing page moderne",
  },
  {
    name: "HTML5 UP - Stellar",
    url: "https://html5up.net/stellar",
    description: "Template startup/minimaliste",
  },
  {
    name: "Cruip - Simple",
    url: "https://cruip.com/simple/",
    description: "Landing page SaaS minimaliste",
  },
  {
    name: "Cruip - Firefox",
    url: "https://cruip.com/firefox/",
    description: "Landing page app mobile",
  },
  {
    name: "Start Bootstrap - Creative",
    url: "https://startbootstrap.com/theme/creative",
    description: "Landing page créative",
  },
  {
    name: "Start Bootstrap - Modern Business",
    url: "https://startbootstrap.com/modern-business",
    description: "Site entreprise",
  },
];