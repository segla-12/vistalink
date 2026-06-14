import type { BlockVariant } from "./types";

// ─── Variants de Hero ────────────────────────────────────
export const heroVariants: BlockVariant[] = [
  {
    id: "hero-minimaliste",
    name: "Hero Minimaliste",
    blockType: "hero",
    preview: "◻️",
    content: {
      title: "Votre titre ici",
      subtitle: "Sous-titre élégant",
      description: "Description courte et percutante.",
      buttonText: "Commencer",
      buttonUrl: "#",
      buttonColor: "#16A34A",
      layout: "center",
      image: "",
      overlay: true,
      fullWidth: true,
    },
    styles: { padding: "80px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" },
  },
  {
    id: "hero-premium",
    name: "Hero Premium",
    blockType: "hero",
    preview: "✨",
    content: {
      title: "L'excellence à portée de main",
      subtitle: "Premium",
      description: "Découvrez une expérience unique conçue pour vous.",
      buttonText: "Découvrir",
      buttonUrl: "#",
      buttonColor: "#818CF8",
      layout: "center",
      image: "",
      overlay: true,
      fullWidth: true,
    },
    styles: { padding: "100px 24px", backgroundColor: "#1E1B4B", textColor: "#ffffff" },
  },
  {
    id: "hero-luxe",
    name: "Hero Luxe",
    blockType: "hero",
    preview: "👑",
    content: {
      title: "L'art du raffinement",
      subtitle: "Luxe",
      description: "Chaque détail compte. Découvrez notre collection exclusive.",
      buttonText: "Explorer",
      buttonUrl: "#",
      buttonColor: "#D4AF37",
      layout: "center",
      image: "",
      overlay: true,
      fullWidth: true,
    },
    styles: { padding: "120px 24px", backgroundColor: "#0C0A09", textColor: "#FAFAF9" },
  },
  {
    id: "hero-business",
    name: "Hero Business",
    blockType: "hero",
    preview: "💼",
    content: {
      title: "Solutions professionnelles",
      subtitle: "Business",
      description: "Des outils puissants pour développer votre activité.",
      buttonText: "Demander un devis",
      buttonUrl: "#",
      buttonColor: "#3B82F6",
      layout: "center",
      image: "",
      overlay: true,
      fullWidth: true,
    },
    styles: { padding: "80px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" },
  },
  {
    id: "hero-restaurant",
    name: "Hero Restaurant",
    blockType: "hero",
    preview: "🍽️",
    content: {
      title: "Saveurs authentiques",
      subtitle: "Restaurant",
      description: "Une expérience culinaire unique au cœur de la ville.",
      buttonText: "Réserver une table",
      buttonUrl: "#",
      buttonColor: "#DC2626",
      layout: "center",
      image: "",
      overlay: true,
      fullWidth: true,
    },
    styles: { padding: "100px 24px", backgroundColor: "#1C1917", textColor: "#FFFBEB" },
  },
];

// ─── Variants de CTA ─────────────────────────────────────
export const ctaVariants: BlockVariant[] = [
  {
    id: "cta-whatsapp",
    name: "CTA WhatsApp",
    blockType: "cta",
    preview: "📱",
    content: {
      title: "Contactez-nous sur WhatsApp",
      description: "Réponse rapide garantie en moins de 5 minutes.",
      buttonText: "Envoyer un message",
      buttonUrl: "#",
      buttonColor: "#25D366",
      layout: "center",
    },
    styles: { padding: "64px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" },
  },
  {
    id: "cta-reservation",
    name: "CTA Réservation",
    blockType: "cta",
    preview: "📅",
    content: {
      title: "Réservez votre place",
      description: "Places limitées. Réservez dès maintenant.",
      buttonText: "Réserver",
      buttonUrl: "#",
      buttonColor: "#DC2626",
      layout: "center",
    },
    styles: { padding: "64px 24px", backgroundColor: "#1C1917", textColor: "#FFFBEB" },
  },
  {
    id: "cta-contact",
    name: "CTA Contact",
    blockType: "cta",
    preview: "✉️",
    content: {
      title: "Parlons de votre projet",
      description: "Nous sommes à votre écoute.",
      buttonText: "Nous contacter",
      buttonUrl: "#",
      buttonColor: "#3B82F6",
      layout: "center",
    },
    styles: { padding: "64px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" },
  },
  {
    id: "cta-devis",
    name: "CTA Devis",
    blockType: "cta",
    preview: "📋",
    content: {
      title: "Demandez un devis gratuit",
      description: "Estimation en 24h. Sans engagement.",
      buttonText: "Demander un devis",
      buttonUrl: "#",
      buttonColor: "#16A34A",
      layout: "center",
    },
    styles: { padding: "64px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" },
  },
];

// ─── Variants de Galerie ─────────────────────────────────
export const galleryVariants: BlockVariant[] = [
  {
    id: "gallery-grid",
    name: "Galerie Grid",
    blockType: "gallery",
    preview: "⊞",
    content: {
      title: "Notre Galerie",
      items: [
        { id: "1", image: "", title: "Image 1" },
        { id: "2", image: "", title: "Image 2" },
        { id: "3", image: "", title: "Image 3" },
        { id: "4", image: "", title: "Image 4" },
        { id: "5", image: "", title: "Image 5" },
        { id: "6", image: "", title: "Image 6" },
      ],
      columns: 3,
    },
    styles: { padding: "64px 24px" },
  },
  {
    id: "gallery-masonry",
    name: "Galerie Masonry",
    blockType: "gallery",
    preview: "⊞⊞",
    content: {
      title: "Portfolio",
      items: [
        { id: "1", image: "", title: "Projet 1" },
        { id: "2", image: "", title: "Projet 2" },
        { id: "3", image: "", title: "Projet 3" },
        { id: "4", image: "", title: "Projet 4" },
      ],
      columns: 2,
    },
    styles: { padding: "64px 24px" },
  },
];

// ─── Variants de Témoignages ─────────────────────────────
export const testimonialsVariants: BlockVariant[] = [
  {
    id: "testimonials-cartes",
    name: "Témoignages Cartes",
    blockType: "testimonials",
    preview: "★",
    content: {
      title: "Ce que disent nos clients",
      items: [
        { id: "1", title: "Client 1", description: "Excellent service ! Je recommande vivement.", rating: 5 },
        { id: "2", title: "Client 2", description: "Professionnel et fiable. Très satisfait.", rating: 5 },
        { id: "3", title: "Client 3", description: "Une expérience exceptionnelle du début à la fin.", rating: 4 },
      ],
      columns: 3,
    },
    styles: { padding: "64px 24px", backgroundColor: "#F0FDF4" },
  },
];

// ─── Variants de Services ────────────────────────────────
export const servicesVariants: BlockVariant[] = [
  {
    id: "services-3colonnes",
    name: "Services 3 Colonnes",
    blockType: "services",
    preview: "⚙",
    content: {
      title: "Nos Services",
      description: "Ce que nous proposons",
      items: [
        { id: "1", title: "Service 1", description: "Description détaillée du service", icon: "★" },
        { id: "2", title: "Service 2", description: "Description détaillée du service", icon: "◆" },
        { id: "3", title: "Service 3", description: "Description détaillée du service", icon: "●" },
      ],
      columns: 3,
    },
    styles: { padding: "64px 24px" },
  },
  {
    id: "services-premium",
    name: "Services Cartes Premium",
    blockType: "services",
    preview: "⚙✨",
    content: {
      title: "Nos Prestations",
      description: "Des services sur mesure pour votre réussite",
      items: [
        { id: "1", title: "Conseil", description: "Accompagnement personnalisé", icon: "💡" },
        { id: "2", title: "Création", description: "Design et développement", icon: "🎨" },
        { id: "3", title: "Stratégie", description: "Plan d'action sur mesure", icon: "📊" },
      ],
      columns: 3,
    },
    styles: { padding: "64px 24px", backgroundColor: "#F8FAFC" },
  },
];

// ─── Variants de Footer ──────────────────────────────────
export const footerVariants: BlockVariant[] = [
  {
    id: "footer-business",
    name: "Footer Business",
    blockType: "footer",
    preview: "💼",
    content: {
      title: "© 2025 Mon Business — Tous droits réservés",
    },
    styles: { padding: "32px 24px", backgroundColor: "#0F172A", textColor: "#94a3b8" },
  },
  {
    id: "footer-corporate",
    name: "Footer Corporate",
    blockType: "footer",
    preview: "🏢",
    content: {
      title: "© 2025 Mon Entreprise — Propulsé par Vistalink",
    },
    styles: { padding: "40px 24px", backgroundColor: "#1E293B", textColor: "#CBD5E1" },
  },
  {
    id: "footer-minimal",
    name: "Footer Minimal",
    blockType: "footer",
    preview: "◻️",
    content: {
      title: "© 2025 Mon Site",
    },
    styles: { padding: "24px 24px", backgroundColor: "#FFFFFF", textColor: "#94a3b8" },
  },
];

// ─── Tous les variants ───────────────────────────────────
export const allBlockVariants: BlockVariant[] = [
  ...heroVariants,
  ...ctaVariants,
  ...galleryVariants,
  ...testimonialsVariants,
  ...servicesVariants,
  ...footerVariants,
];

// ─── Obtenir les variants par type de bloc ───────────────
export function getVariantsByBlockType(blockType: string): BlockVariant[] {
  return allBlockVariants.filter((v) => v.blockType === blockType);
}

// ─── Obtenir un variant par ID ───────────────────────────
export function getVariant(id: string): BlockVariant | undefined {
  return allBlockVariants.find((v) => v.id === id);
}