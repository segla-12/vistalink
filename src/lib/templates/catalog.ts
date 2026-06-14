import type { Template, CategoryMeta, TemplateCategory } from "./types";
import type { Block } from "@/lib/blocks/types";

export const categories: CategoryMeta[] = [
  { id: "restaurant", name: "Restaurant", icon: "🍽️", description: "Menus, réservations, ambiance" },
  { id: "commerce", name: "Commerce", icon: "🛍️", description: "Boutiques, produits, ventes" },
  { id: "photographe", name: "Photographe", icon: "📷", description: "Portfolio, galeries, shootings" },
  { id: "graphiste", name: "Graphiste", icon: "🎨", description: "Design, créations, portfolio" },
  { id: "medecin", name: "Médecin", icon: "⚕️", description: "Cabinets, rendez-vous, services" },
  { id: "garage", name: "Garage", icon: "🔧", description: "Réparations, véhicules, services" },
  { id: "styliste", name: "Styliste", icon: "👗", description: "Mode, collections, lookbooks" },
  { id: "immobilier", name: "Immobilier", icon: "🏠", description: "Biens, agences, ventes" },
  { id: "consultant", name: "Consultant", icon: "💼", description: "Conseil, expertise, accompagnement" },
  { id: "artisan", name: "Artisan", icon: "🔨", description: "Métiers, savoir-faire, créations" },
  { id: "formation", name: "Formation", icon: "📚", description: "Cours, formations, coaching" },
  { id: "portfolio", name: "Portfolio", icon: "🖼️", description: "Projets, réalisations, créations" },
];

function b(type: string, content: Record<string, any>, styles: Record<string, any> = {}, order = 0): Block {
  return { id: `${type}-${order}-${Math.random().toString(36).slice(2, 6)}`, type: type as any, content, styles, order, visible: true };
}

function hero(title: string, subtitle: string, desc: string, btn: string, color: string, bg: string, tc: string, pad = "100px 24px", order = 0): Block {
  return b("hero", { title, subtitle, description: desc, buttonText: btn, buttonUrl: "#", buttonColor: color, layout: "center", image: "", overlay: true, fullWidth: true }, { padding: pad, backgroundColor: bg, textColor: tc }, order);
}

function cta(title: string, desc: string, btn: string, color: string, bg: string, tc: string, order: number): Block {
  return b("cta", { title, description: desc, buttonText: btn, buttonUrl: "#", buttonColor: color }, { padding: "64px 24px", backgroundColor: bg, textColor: tc }, order);
}

function footer(text: string, bg = "#0F172A", tc = "#94a3b8", order: number): Block {
  return b("footer", { title: text }, { padding: "32px 24px", backgroundColor: bg, textColor: tc }, order);
}

export const templates: Template[] = [
  // ═══════ RESTAURANT ═══════
  {
    id: "restaurant-premium", name: "Restaurant Premium", description: "Template élégant pour restaurants gastronomiques", category: "restaurant", projectType: "landing", preview: "🍽️", tags: ["restaurant", "gastronomie"], recommendedTheme: "restaurant",
    blocks: [
      hero("Saveurs Authentiques", "Restaurant Gastronomique", "Une expérience culinaire unique au cœur de la ville.", "Réserver une table", "#DC2626", "#1C1917", "#FFFBEB"),
      b("text", { title: "Notre Histoire", description: "Depuis 2010, cuisine française authentique.", subtitle: "Depuis 2010" }, { padding: "64px 24px", backgroundColor: "#FFFFFF" }, 1),
      b("products", { title: "Notre Menu", items: [{ id: "1", title: "Entrée du Chef", description: "Foie gras mi-cuit", price: "15 000 FCFA", image: "" }, { id: "2", title: "Plat Signature", description: "Filet de bœuf", price: "25 000 FCFA", image: "" }, { id: "3", title: "Dessert Maison", description: "Tarte au citron", price: "8 000 FCFA", image: "" }], buttonText: "Commander" }, { padding: "64px 24px", backgroundColor: "#F8FAFC" }, 2),
      b("testimonials", { title: "Avis clients", items: [{ id: "1", title: "Marie D.", description: "Expérience exceptionnelle.", rating: 5 }, { id: "2", title: "Jean P.", description: "Meilleur restaurant.", rating: 5 }] }, { padding: "64px 24px", backgroundColor: "#F0FDF4" }, 3),
      cta("Réservez votre table", "Places limitées.", "Réserver", "#DC2626", "#1C1917", "#FFFBEB", 4),
      footer("© 2025 Restaurant Premium", "#0F172A", "#94a3b8", 5),
    ],
  },
  {
    id: "restaurant-bistro", name: "Bistro Moderne", description: "Bistrots et brasseries", category: "restaurant", projectType: "landing", preview: "🍺", tags: ["bistro"], recommendedTheme: "boutique",
    blocks: [
      hero("Le Bistro du Coin", "Brasserie", "Cuisine française traditionnelle.", "Voir le menu", "#EA580C", "#7C2D12", "#FFFBEB"),
      b("products", { title: "Spécialités", items: [{ id: "1", title: "Burger", description: "Bœuf Angus", price: "12 000 FCFA", image: "" }, { id: "2", title: "Pizza", description: "Margherita", price: "8 000 FCFA", image: "" }], buttonText: "Commander" }, { padding: "64px 24px", backgroundColor: "#FFFBEB" }, 1),
      cta("Commandez en ligne", "Livraison rapide.", "Commander", "#EA580C", "#7C2D12", "#FFFBEB", 2),
      footer("© 2025 Le Bistro", "#431407", "#FED7AA", 3),
    ],
  },
  // ═══════ COMMERCE ═══════
  {
    id: "commerce-boutique", name: "Boutique en Ligne", description: "Boutiques et commerces", category: "commerce", projectType: "catalogue", preview: "🛍️", tags: ["commerce"], recommendedTheme: "boutique",
    blocks: [
      hero("Boutique Exclusive", "Nouvelle Collection", "Produits tendance.", "Voir la collection", "#EA580C", "#7C2D12", "#FFFBEB"),
      b("products", { title: "Nos Produits", items: [{ id: "1", title: "Produit 1", description: "Description", price: "15 000 FCFA", image: "" }, { id: "2", title: "Produit 2", description: "Description", price: "25 000 FCFA", image: "" }, { id: "3", title: "Produit 3", description: "Description", price: "10 000 FCFA", image: "" }, { id: "4", title: "Produit 4", description: "Description", price: "30 000 FCFA", image: "" }, { id: "5", title: "Produit 5", description: "Description", price: "20 000 FCFA", image: "" }, { id: "6", title: "Produit 6", description: "Description", price: "18 000 FCFA", image: "" }], buttonText: "Commander" }, { padding: "64px 24px", backgroundColor: "#FFFBEB" }, 1),
      cta("Commandez maintenant", "Livraison gratuite dès 50 000 FCFA.", "Commander", "#EA580C", "#7C2D12", "#FFFBEB", 3),
      footer("© 2025 Boutique Exclusive", "#431407", "#FED7AA", 4),
    ],
  },
  // ═══════ PHOTOGRAPHE ═══════
  {
    id: "photographe-portfolio", name: "Portfolio Photographe", description: "Photographes professionnels", category: "photographe", projectType: "portfolio", preview: "📷", tags: ["photographe"], recommendedTheme: "portfolio",
    blocks: [
      hero("Photographie d'Art", "Portfolio", "Chaque photo raconte une histoire.", "Voir le portfolio", "#8B5CF6", "#0F172A", "#ffffff", "120px 24px"),
      b("gallery", { title: "Portfolio", items: [{ id: "1", image: "", title: "Projet 1" }, { id: "2", image: "", title: "Projet 2" }, { id: "3", image: "", title: "Projet 3" }, { id: "4", image: "", title: "Projet 4" }, { id: "5", image: "", title: "Projet 5" }, { id: "6", image: "", title: "Projet 6" }], columns: 3 }, { padding: "64px 24px" }, 1),
      b("about", { title: "À propos", description: "Photographe depuis 10 ans.", subtitle: "Photographe", image: "" }, { padding: "64px 24px" }, 2),
      cta("Réservez votre shooting", "Disponible pour vos projets.", "Me contacter", "#8B5CF6", "#0F172A", "#ffffff", 3),
      footer("© 2025 Portfolio Photo", "#0F172A", "#94a3b8", 4),
    ],
  },
  // ═══════ GRAPHISTE ═══════
  {
    id: "graphiste-portfolio", name: "Portfolio Graphiste", description: "Graphistes et designers", category: "graphiste", projectType: "portfolio", preview: "🎨", tags: ["graphiste"], recommendedTheme: "creatif",
    blocks: [
      hero("Design & Créativité", "Graphiste", "Vos idées en designs impactants.", "Voir mes projets", "#F59E0B", "#1E1B4B", "#ffffff", "120px 24px"),
      b("features", { title: "Mes Services", items: [{ id: "1", title: "Identité Visuelle", description: "Logo, charte", icon: "🎨" }, { id: "2", title: "Print", description: "Flyers, affiches", icon: "🖨️" }, { id: "3", title: "Digital", description: "Web design", icon: "💻" }] }, { padding: "64px 24px" }, 1),
      b("gallery", { title: "Projets Récents", items: [{ id: "1", image: "", title: "P1" }, { id: "2", image: "", title: "P2" }, { id: "3", image: "", title: "P3" }, { id: "4", image: "", title: "P4" }], columns: 2 }, { padding: "64px 24px" }, 2),
      cta("Travaillons ensemble", "Votre projet commence ici.", "Me contacter", "#F59E0B", "#1E1B4B", "#ffffff", 3),
      footer("© 2025 Portfolio Graphiste", "#1E1B4B", "#FDE68A", 4),
    ],
  },
  // ═══════ MÉDECIN ═══════
  {
    id: "medecin-cabinet", name: "Cabinet Médical", description: "Cabinets médicaux", category: "medecin", projectType: "minisite", preview: "⚕️", tags: ["médecin"], recommendedTheme: "business",
    blocks: [
      hero("Cabinet Médical", "Votre santé, notre priorité", "Soins de qualité.", "Prendre RDV", "#3B82F6", "#0F172A", "#ffffff"),
      b("services", { title: "Nos Services", items: [{ id: "1", title: "Consultation", description: "Examens généraux", icon: "🩺" }, { id: "2", title: "Spécialités", description: "Cardiologie", icon: "❤️" }, { id: "3", title: "Analyses", description: "Laboratoire", icon: "🔬" }] }, { padding: "64px 24px", backgroundColor: "#F8FAFC" }, 1),
      cta("Prenez rendez-vous", "Du lundi au samedi.", "Réserver", "#3B82F6", "#0F172A", "#ffffff", 2),
      footer("© 2025 Cabinet Médical", "#0F172A", "#94a3b8", 3),
    ],
  },
  // ═══════ GARAGE ═══════
  {
    id: "garage-auto", name: "Garage Automobile", description: "Garages et mécaniciens", category: "garage", projectType: "minisite", preview: "🔧", tags: ["garage"], recommendedTheme: "business",
    blocks: [
      hero("Garage Auto Pro", "Réparation & Entretien", "Mécaniciens qualifiés.", "Demander un devis", "#3B82F6", "#0F172A", "#ffffff"),
      b("services", { title: "Nos Services", items: [{ id: "1", title: "Réparation", description: "Mécanique", icon: "🔧" }, { id: "2", title: "Entretien", description: "Vidange, freins", icon: "🛞" }, { id: "3", title: "Carrosserie", description: "Peinture", icon: "🚗" }] }, { padding: "64px 24px", backgroundColor: "#F8FAFC" }, 1),
      cta("Devis gratuit", "En 24h.", "Demander", "#3B82F6", "#0F172A", "#ffffff", 2),
      footer("© 2025 Garage Auto Pro", "#0F172A", "#94a3b8", 3),
    ],
  },
  // ═══════ STYLISTE ═══════
  {
    id: "styliste-mode", name: "Styliste Mode", description: "Stylistes et créateurs de mode", category: "styliste", projectType: "portfolio", preview: "👗", tags: ["styliste"], recommendedTheme: "luxe",
    blocks: [
      hero("Mode & Style", "Styliste", "Créations uniques.", "Voir la collection", "#D4AF37", "#0C0A09", "#FAFAF9", "120px 24px"),
      b("gallery", { title: "Collection", items: [{ id: "1", image: "", title: "Look 1" }, { id: "2", image: "", title: "Look 2" }, { id: "3", image: "", title: "Look 3" }, { id: "4", image: "", title: "Look 4" }], columns: 2 }, { padding: "64px 24px" }, 1),
      cta("Commandez une création", "Sur mesure.", "Me contacter", "#D4AF37", "#0C0A09", "#FAFAF9", 2),
      footer("© 2025 Styliste Mode", "#0C0A09", "#E7E5E4", 3),
    ],
  },
  // ═══════ IMMOBILIER ═══════
  {
    id: "immobilier-agence", name: "Agence Immobilière", description: "Agences immobilières", category: "immobilier", projectType: "minisite", preview: "🏠", tags: ["immobilier"], recommendedTheme: "corporate",
    blocks: [
      hero("Trouvez votre bien", "Agence Immobilière", "Biens sélectionnés.", "Voir les biens", "#2563EB", "#0F172A", "#ffffff"),
      b("products", { title: "Nos Biens", items: [{ id: "1", title: "Appartement 3p", description: "80m²", price: "45M FCFA", image: "" }, { id: "2", title: "Villa", description: "200m²", price: "120M FCFA", image: "" }], buttonText: "Voir" }, { padding: "64px 24px", backgroundColor: "#F1F5F9" }, 1),
      cta("Contactez-nous", "Parlons de votre projet.", "Nous contacter", "#2563EB", "#0F172A", "#ffffff", 2),
      footer("© 2025 Agence Immobilière", "#0F172A", "#94a3b8", 3),
    ],
  },
  // ═══════ CONSULTANT ═══════
  {
    id: "consultant-business", name: "Consultant Business", description: "Consultants et coaches", category: "consultant", projectType: "landing", preview: "💼", tags: ["consultant"], recommendedTheme: "business",
    blocks: [
      hero("Accompagnement Stratégique", "Consultant", "Stratégies éprouvées.", "Réserver un appel", "#3B82F6", "#0F172A", "#ffffff"),
      b("features", { title: "Expertises", items: [{ id: "1", title: "Stratégie", description: "Plan d'action", icon: "📊" }, { id: "2", title: "Marketing", description: "Digital", icon: "📈" }, { id: "3", title: "Management", description: "Leadership", icon: "👥" }] }, { padding: "64px 24px" }, 1),
      b("stats", { title: "Résultats", stats: [{ label: "Clients", value: "200+" }, { label: "Années", value: "10+" }, { label: "Satisfaction", value: "98%" }] }, { padding: "64px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" }, 2),
      cta("Appel gratuit", "30 min pour votre projet.", "Réserver", "#3B82F6", "#0F172A", "#ffffff", 3),
      footer("© 2025 Consultant Business", "#0F172A", "#94a3b8", 4),
    ],
  },
  // ═══════ ARTISAN ═══════
  {
    id: "artisan-creations", name: "Artisan Créateur", description: "Artisans et artisans d'art", category: "artisan", projectType: "catalogue", preview: "🔨", tags: ["artisan"], recommendedTheme: "boutique",
    blocks: [
      hero("Savoir-Faire Artisanal", "Artisan", "Créations uniques faites main.", "Découvrir", "#EA580C", "#7C2D12", "#FFFBEB"),
      b("products", { title: "Créations", items: [{ id: "1", title: "Création 1", description: "Pièce unique", price: "25 000 FCFA", image: "" }, { id: "2", title: "Création 2", description: "Pièce unique", price: "35 000 FCFA", image: "" }], buttonText: "Commander" }, { padding: "64px 24px", backgroundColor: "#FFFBEB" }, 1),
      cta("Commandez une création", "Sur mesure.", "Me contacter", "#EA580C", "#7C2D12", "#FFFBEB", 2),
      footer("© 2025 Artisan Créateur", "#431407", "#FED7AA", 3),
    ],
  },
  // ═══════ FORMATION ═══════
  {
    id: "formation-coaching", name: "Formation & Coaching", description: "Formateurs et coaches", category: "formation", projectType: "landing", preview: "📚", tags: ["formation"], recommendedTheme: "business",
    blocks: [
      hero("Formations Pro", "Coaching", "Développez vos compétences.", "Voir les formations", "#3B82F6", "#0F172A", "#ffffff"),
      b("products", { title: "Formations", items: [{ id: "1", title: "Marketing Digital", description: "Réseaux sociaux", price: "150 000 FCFA", image: "" }, { id: "2", title: "Leadership", description: "Management", price: "200 000 FCFA", image: "" }], buttonText: "S'inscrire" }, { padding: "64px 24px", backgroundColor: "#F8FAFC" }, 1),
      b("stats", { title: "Résultats", stats: [{ label: "Élèves", value: "500+" }, { label: "Réussite", value: "95%" }] }, { padding: "64px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" }, 2),
      cta("Inscrivez-vous", "Places limitées.", "S'inscrire", "#3B82F6", "#0F172A", "#ffffff", 3),
      footer("© 2025 Formation & Coaching", "#0F172A", "#94a3b8", 4),
    ],
  },
  // ═══════ PORTFOLIO ═══════
  {
    id: "portfolio-creator", name: "Portfolio Créatif", description: "Portfolio pour créatifs", category: "portfolio", projectType: "portfolio", preview: "🖼️", tags: ["portfolio"], recommendedTheme: "portfolio",
    blocks: [
      hero("Mon Portfolio", "Créatif", "Projets uniques.", "Voir les projets", "#8B5CF6", "#0F172A", "#ffffff", "120px 24px"),
      b("gallery", { title: "Projets", items: [{ id: "1", image: "", title: "P1" }, { id: "2", image: "", title: "P2" }, { id: "3", image: "", title: "P3" }, { id: "4", image: "", title: "P4" }, { id: "5", image: "", title: "P5" }, { id: "6", image: "", title: "P6" }], columns: 3 }, { padding: "64px 24px" }, 1),
      cta("Travaillons ensemble", "Votre projet commence ici.", "Me contacter", "#8B5CF6", "#0F172A", "#ffffff", 2),
      footer("© 2025 Portfolio Créatif", "#0F172A", "#94a3b8", 3),
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────
export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return templates.filter((t) => t.category === category);
}

export function getTemplatesByProjectType(type: string): Template[] {
  return templates.filter((t) => t.projectType === type);
}

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getCategoryMeta(id: TemplateCategory): CategoryMeta | undefined {
  return categories.find((c) => c.id === id);
}