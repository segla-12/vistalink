import type { BlockMeta, BlockType } from "./types";

// ─── Registry de tous les blocs disponibles ─────────────
const blockRegistry = new Map<BlockType, BlockMeta>();

export function registerBlock(meta: BlockMeta) {
  blockRegistry.set(meta.type, meta);
}

export function getBlockMeta(type: BlockType): BlockMeta | undefined {
  return blockRegistry.get(type);
}

export function getAllBlockMetas(): BlockMeta[] {
  return Array.from(blockRegistry.values());
}

export function getBlocksByCategory(category: BlockMeta["category"]): BlockMeta[] {
  return getAllBlockMetas().filter((b) => b.category === category);
}

// ─── Initialisation des blocs ────────────────────────
export function initBlockRegistry() {
  const blocks: BlockMeta[] = [
    // ── STRUCTURE ──
    {
      type: "header",
      label: "Header",
      icon: "⊞",
      description: "Barre de navigation avec logo et menu",
      category: "structure",
      defaultContent: {
        title: "Mon Business",
        layout: "center",
      },
      defaultStyles: {
        backgroundColor: "#ffffff",
        padding: "16px 24px",
      },
    },
    {
      type: "footer",
      label: "Footer",
      icon: "⊡",
      description: "Pied de page avec liens et copyright",
      category: "structure",
      defaultContent: {
        title: "© 2026 Mon Business",
      },
      defaultStyles: {
        backgroundColor: "#0F172A",
        textColor: "#ffffff",
        padding: "32px 24px",
      },
    },

    // ── CONTENT ──
    {
      type: "hero",
      label: "Hero",
      icon: "◆",
      description: "Bannière principale avec image, titre et CTA",
      category: "content",
      defaultContent: {
        title: "Titre principal",
        subtitle: "Sous-titre accrocheur",
        description: "Description qui vend votre offre en quelques secondes.",
        buttonText: "Commencer",
        buttonUrl: "#",
        buttonColor: "#16A34A",
        layout: "center",
        image: "",
        overlay: true,
        fullWidth: true,
      },
      defaultStyles: {
        padding: "80px 24px",
        backgroundColor: "#0F172A",
        textColor: "#ffffff",
      },
    },
    {
      type: "text",
      label: "Texte",
      icon: "T",
      description: "Bloc de texte simple avec titre et paragraphe",
      category: "content",
      defaultContent: {
        title: "Titre de la section",
        description: "Contenu textuel de votre section.",
        layout: "center",
      },
      defaultStyles: {
        padding: "48px 24px",
        maxWidth: "800px",
      },
    },
    {
      type: "image",
      label: "Image",
      icon: "▣",
      description: "Image plein largeur ou centrée",
      category: "content",
      defaultContent: {
        image: "",
        layout: "center",
        fullWidth: false,
      },
      defaultStyles: {
        padding: "24px",
        borderRadius: "16px",
      },
    },
    {
      type: "divider",
      label: "Séparateur",
      icon: "—",
      description: "Ligne de séparation élégante",
      category: "content",
      defaultContent: {},
      defaultStyles: {
        padding: "24px",
      },
    },
    {
      type: "embed",
      label: "Embed",
      icon: "🔌",
      description: "Code intégré (iframe, widget, etc.)",
      category: "content",
      defaultContent: {
        embedCode: "<iframe src='https://example.com'></iframe>",
      },
      defaultStyles: {
        padding: "24px",
      },
    },

    // ── MEDIA ──
    {
      type: "gallery",
      label: "Galerie",
      icon: "⊞⊞",
      description: "Grille d'images en masonry",
      category: "media",
      defaultContent: {
        title: "Galerie",
        items: [
          { id: "1", image: "", title: "Image 1" },
          { id: "2", image: "", title: "Image 2" },
          { id: "3", image: "", title: "Image 3" },
        ],
        columns: 3,
      },
      defaultStyles: {
        padding: "64px 24px",
      },
    },
    {
      type: "video",
      label: "Vidéo",
      icon: "▶",
      description: "Vidéo YouTube, Vimeo ou upload",
      category: "media",
      defaultContent: {
        video: "",
        title: "Vidéo de présentation",
      },
      defaultStyles: {
        padding: "48px 24px",
        maxWidth: "800px",
      },
    },
    {
      type: "products",
      label: "Produits",
      icon: "⊞",
      description: "Grille de produits/services avec prix",
      category: "media",
      defaultContent: {
        title: "Nos produits",
        description: "Découvrez notre sélection",
        items: [
          { id: "1", title: "Produit 1", price: "15 000 FCFA", description: "Description du produit" },
          { id: "2", title: "Produit 2", price: "25 000 FCFA", description: "Description du produit" },
          { id: "3", title: "Produit 3", price: "35 000 FCFA", description: "Description du produit" },
        ],
        columns: 3,
      },
      defaultStyles: {
        padding: "64px 24px",
        backgroundColor: "#F8FAFC",
      },
    },
    {
      type: "services",
      label: "Services",
      icon: "⚙",
      description: "Liste de services avec icônes",
      category: "media",
      defaultContent: {
        title: "Nos services",
        description: "Ce que nous proposons",
        items: [
          { id: "1", title: "Service 1", description: "Description détaillée du service", icon: "★" },
          { id: "2", title: "Service 2", description: "Description détaillée du service", icon: "◆" },
          { id: "3", title: "Service 3", description: "Description détaillée du service", icon: "●" },
        ],
        columns: 3,
      },
      defaultStyles: {
        padding: "64px 24px",
      },
    },

    // ── SOCIAL PROOF ──
    {
      type: "about",
      label: "À propos",
      icon: "ℹ",
      description: "Section présentation de l'entreprise",
      category: "content",
      defaultContent: {
        title: "À propos",
        description: "Notre histoire et nos valeurs.",
        image: "",
        layout: "split",
      },
      defaultStyles: {
        padding: "64px 24px",
      },
    },
    {
      type: "testimonials",
      label: "Témoignages",
      icon: "★",
      description: "Avis clients avec notes",
      category: "social",
      defaultContent: {
        title: "Ce que disent nos clients",
        items: [
          { id: "1", title: "Client 1", description: "Excellent service !", rating: 5 },
          { id: "2", title: "Client 2", description: "Je recommande vivement.", rating: 5 },
          { id: "3", title: "Client 3", description: "Professionnel et fiable.", rating: 4 },
        ],
        columns: 3,
      },
      defaultStyles: {
        padding: "64px 24px",
        backgroundColor: "#F0FDF4",
      },
    },
    {
      type: "stats",
      label: "Statistiques",
      icon: "📊",
      description: "Chiffres clés et statistiques",
      category: "social",
      defaultContent: {
        title: "Nos chiffres",
        stats: [
          { label: "Clients", value: "500+" },
          { label: "Projets", value: "1000+" },
          { label: "Années", value: "10+" },
        ],
        columns: 3,
      },
      defaultStyles: {
        padding: "64px 24px",
        backgroundColor: "#0F172A",
        textColor: "#ffffff",
      },
    },
    {
      type: "team",
      label: "Équipe",
      icon: "👥",
      description: "Présentation de l'équipe",
      category: "social",
      defaultContent: {
        title: "Notre équipe",
        teamMembers: [
          { name: "Nom", role: "Fonction" },
          { name: "Nom", role: "Fonction" },
          { name: "Nom", role: "Fonction" },
        ],
      },
      defaultStyles: {
        padding: "64px 24px",
      },
    },
    {
      type: "logos",
      label: "Partenaires",
      icon: "⊟",
      description: "Logo des partenaires ou clients",
      category: "social",
      defaultContent: {
        title: "Ils nous font confiance",
        logos: [
          { src: "", alt: "Logo 1" },
          { src: "", alt: "Logo 2" },
          { src: "", alt: "Logo 3" },
        ],
      },
      defaultStyles: {
        padding: "48px 24px",
      },
    },

    // ── CONVERSION ──
    {
      type: "cta",
      label: "Appel à l'action",
      icon: "▸",
      description: "Bouton d'action principal",
      category: "conversion",
      defaultContent: {
        title: "Prêt à commencer ?",
        description: "Rejoignez-nous dès aujourd'hui.",
        buttonText: "Contactez-nous",
        buttonUrl: "#",
        buttonColor: "#16A34A",
        layout: "center",
      },
      defaultStyles: {
        padding: "64px 24px",
        backgroundColor: "#0F172A",
        textColor: "#ffffff",
      },
    },
    {
      type: "contact",
      label: "Contact",
      icon: "✉",
      description: "Coordonnées et formulaire de contact",
      category: "conversion",
      defaultContent: {
        title: "Contactez-nous",
        description: "Nous sommes à votre écoute",
        buttonText: "Envoyer",
        buttonColor: "#16A34A",
        layout: "center",
      },
      defaultStyles: {
        padding: "64px 24px",
      },
    },
    {
      type: "form",
      label: "Formulaire",
      icon: "☰",
      description: "Formulaire de collecte personnalisé",
      category: "conversion",
      defaultContent: {
        title: "Nous contacter",
        buttonText: "Envoyer",
        buttonColor: "#16A34A",
        formFields: [
          { type: "text", label: "Nom", required: true },
          { type: "email", label: "Email", required: true },
          { type: "textarea", label: "Message", required: true },
        ],
      },
      defaultStyles: {
        padding: "48px 24px",
        maxWidth: "600px",
      },
    },
    {
      type: "pricing",
      label: "Tarifs",
      icon: "€",
      description: "Grille de prix et forfaits",
      category: "conversion",
      defaultContent: {
        title: "Nos tarifs",
        description: "Choisissez l'offre qui vous convient",
        pricingPlans: [
          { name: "Basic", price: "15 000 FCFA", features: ["Feature 1", "Feature 2"], cta: "Choisir" },
          { name: "Pro", price: "25 000 FCFA", features: ["Feature 1", "Feature 2", "Feature 3"], cta: "Choisir", highlight: true },
          { name: "Premium", price: "35 000 FCFA", features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"], cta: "Choisir" },
        ],
        columns: 3,
      },
      defaultStyles: {
        padding: "64px 24px",
        backgroundColor: "#F8FAFC",
      },
    },
    {
      type: "countdown",
      label: "Compte à rebours",
      icon: "⏱",
      description: "Timer d'urgence pour promotions",
      category: "conversion",
      defaultContent: {
        title: "Offre limitée",
        description: "Profitez de cette offre avant la fin du compte à rebours",
        countdownDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      defaultStyles: {
        padding: "64px 24px",
        backgroundColor: "#0F172A",
        textColor: "#ffffff",
      },
    },
    {
      type: "qrcode",
      label: "QR Code",
      icon: "⊟",
      description: "QR Code de la page",
      category: "conversion",
      defaultContent: {
        title: "Scannez pour accéder",
      },
      defaultStyles: {
        padding: "48px 24px",
      },
    },
    {
      type: "social",
      label: "Réseaux sociaux",
      icon: "🔗",
      description: "Liens vers vos réseaux sociaux",
      category: "social",
      defaultContent: {
        title: "Suivez-nous",
        socialLinks: [
          { platform: "facebook", url: "#" },
          { platform: "instagram", url: "#" },
          { platform: "whatsapp", url: "#" },
        ],
      },
      defaultStyles: {
        padding: "48px 24px",
      },
    },

    // ── FAQ ──
    {
      type: "faq",
      label: "FAQ",
      icon: "?",
      description: "Questions fréquentes",
      category: "content",
      defaultContent: {
        title: "Questions fréquentes",
        faqItems: [
          { question: "Question 1 ?", answer: "Réponse détaillée à la question." },
          { question: "Question 2 ?", answer: "Réponse détaillée à la question." },
          { question: "Question 3 ?", answer: "Réponse détaillée à la question." },
        ],
      },
      defaultStyles: {
        padding: "64px 24px",
        maxWidth: "800px",
      },
    },
    {
      type: "features",
      label: "Fonctionnalités",
      icon: "✦",
      description: "Grille de fonctionnalités avec icônes",
      category: "content",
      defaultContent: {
        title: "Nos fonctionnalités",
        items: [
          { id: "1", title: "Fonctionnalité 1", description: "Description", icon: "⚡" },
          { id: "2", title: "Fonctionnalité 2", description: "Description", icon: "🛡️" },
          { id: "3", title: "Fonctionnalité 3", description: "Description", icon: "🎯" },
        ],
        columns: 3,
      },
      defaultStyles: {
        padding: "64px 24px",
      },
    },
    {
      type: "map",
      label: "Carte",
      icon: "🗺",
      description: "Google Maps intégré",
      category: "media",
      defaultContent: {
        title: "Nous trouver",
        embedCode: "",
      },
      defaultStyles: {
        padding: "48px 24px",
      },
    },
  ];

  for (const block of blocks) {
    registerBlock(block);
  }
}