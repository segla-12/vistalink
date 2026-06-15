import type { Template, CategoryMeta, TemplateCategory } from "./types";
import type { Block } from "@/lib/blocks/types";

export const categories: CategoryMeta[] = [
  { id: "restaurant", name: "Restaurant", icon: "🍽️", description: "Menus, réservations, ambiance" },
  { id: "commerce", name: "Boutique", icon: "🛍️", description: "Boutiques, produits, ventes" },
  { id: "photographe", name: "Photographe", icon: "📷", description: "Portfolio, galeries, shootings" },
  { id: "coiffeur", name: "Coiffeur", icon: "💇", description: "Salons, coiffure, beauté" },
  { id: "medecin", name: "Médecin", icon: "⚕️", description: "Cabinets, rendez-vous, services" },
  { id: "garage", name: "Garage", icon: "🔧", description: "Réparations, véhicules, services" },
  { id: "styliste", name: "Créateur", icon: "👗", description: "Mode, collections, lookbooks" },
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
  // ═══════ ENTREPRENEUR ═══════
  {
    id: "entrepreneur-pro", name: "Entrepreneur Pro", description: "Template haut de gamme pour entrepreneurs et startups SaaS", category: "consultant", projectType: "landing", preview: "🚀", tags: ["entrepreneur", "startup", "saas"], recommendedTheme: "business",
    blocks: [
      hero("Construisez votre empire", "Entrepreneur", "La plateforme tout-en-un pour lancer et développer votre projet.", "Commencer gratuitement", "#10B981", "#0F172A", "#ffffff", "140px 24px"),
      b("logos", { title: "Ils nous font confiance", logos: [{ src: "", alt: "Logo 1" }, { src: "", alt: "Logo 2" }, { src: "", alt: "Logo 3" }, { src: "", alt: "Logo 4" }, { src: "", alt: "Logo 5" }] }, { padding: "48px 24px", backgroundColor: "#F8FAFC" }, 1),
      b("features", { title: "Tout ce dont vous avez besoin", subtitle: "Fonctionnalités", description: "Des outils puissants pour gérer votre activité.", items: [{ id: "1", title: "Landing Pages", description: "Créez des pages qui convertissent en minutes", icon: "📄" }, { id: "2", title: "Funnels Marketing", description: "Automatisez vos ventes", icon: "🔀" }, { id: "3", title: "Analyse & Stats", description: "Suivez vos performances", icon: "📊" }, { id: "4", title: "Email Marketing", description: "Restez en contact avec vos clients", icon: "📧" }, { id: "5", title: "Paiements", description: "Acceptez les paiements facilement", icon: "💳" }, { id: "6", title: "Support 24/7", description: "Une équipe à votre écoute", icon: "🎧" }] }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 2),
      b("stats", { title: "Nos chiffres parlent d'eux-mêmes", stats: [{ label: "Utilisateurs actifs", value: "12 000+" }, { label: "Pays couverts", value: "45+" }, { label: "Taux de satisfaction", value: "98%" }, { label: "Pages créées", value: "150 000+" }] }, { padding: "80px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" }, 3),
      b("pricing", { title: "Des offres pour tous", description: "Choisissez le plan qui vous convient", pricingPlans: [{ name: "Starter", price: "Gratuit", features: ["1 projet", "Blocs de base", "Hébergement inclus"], cta: "Commencer", highlight: false }, { name: "Pro", price: "9 900 FCFA/mois", features: ["Projets illimités", "Tous les blocs", "Domaine personnalisé", "Statistiques"], cta: "Essayer", highlight: true }, { name: "Business", price: "19 900 FCFA/mois", features: ["Tout le plan Pro", "API accès", "Support prioritaire", "Revendeur"], cta: "Nous contacter", highlight: false }] }, { padding: "80px 24px", backgroundColor: "#F8FAFC" }, 4),
      b("testimonials", { title: "Ce qu'ils disent", items: [{ id: "1", title: "Sophie M.", description: "Vistalink a changé ma façon de travailler. Je crée des pages en 5 minutes !", rating: 5 }, { id: "2", title: "David K.", description: "Le meilleur outil pour les entrepreneurs africains.", rating: 5 }, { id: "3", title: "Aminata S.", description: "Simple, rapide, professionnel. Je recommande !", rating: 5 }] }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 5),
      cta("Prêt à vous lancer ?", "Rejoignez des milliers d'entrepreneurs qui nous font confiance.", "Créer mon compte", "#10B981", "#0F172A", "#ffffff", 6),
      b("faq", { title: "Questions fréquentes", faqItems: [{ question: "Combien de temps pour créer une page ?", answer: "Moins de 5 minutes avec nos templates prêts à l'emploi." }, { question: "Puis-je utiliser mon propre nom de domaine ?", answer: "Oui, avec les offres Pro et Business." }, { question: "Est-ce que je peux vendre mes créations ?", answer: "Oui, notre offre Business vous permet de revendre." }] }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 7),
      footer("© 2025 Entrepreneur Pro. Tous droits réservés.", "#0F172A", "#94a3b8", 8),
    ],
  },

  // ═══════ RESTAURANT ═══════
  {
    id: "restaurant-premium", name: "Restaurant Gastronomique", description: "Template élégant style HTML5 UP pour restaurants haut de gamme", category: "restaurant", projectType: "landing", preview: "🍽️", tags: ["restaurant", "gastronomie", "luxe"], recommendedTheme: "restaurant",
    blocks: [
      hero("Art de la Table", "Restaurant Gastronomique", "Une expérience culinaire d'exception dans un cadre raffiné.", "Réserver une table", "#B91C1C", "#1A1110", "#FEF2F2", "160px 24px"),
      b("about", { title: "Notre Philosophie", description: "Depuis 2015, notre chef étoilé sublime les produits locaux pour créer des plats qui racontent une histoire. Chaque assiette est une œuvre d'art.", subtitle: "Savoir-faire & Passion", image: "" }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 1),
      b("gallery", { title: "Ambiance & Créations", items: [{ id: "1", image: "", title: "Salle Privée" }, { id: "2", image: "", title: "Plat Signature" }, { id: "3", image: "", title: "Bar à Vins" }, { id: "4", image: "", title: "Terrasse" }, { id: "5", image: "", title: "Dessert" }, { id: "6", image: "", title: "Entrée" }], columns: 3 }, { padding: "80px 24px", backgroundColor: "#F9FAFB" }, 2),
      b("products", { title: "Menu Dégustation", items: [{ id: "1", title: "Entrée", description: "Foie gras mi-cuit, chutney de figues", price: "18 000 FCFA", image: "" }, { id: "2", title: "Plat", description: "Filet de bœuf Wagyu, purée truffée", price: "35 000 FCFA", image: "" }, { id: "3", title: "Dessert", description: "Soufflé au chocolat, glace vanille", price: "12 000 FCFA", image: "" }, { id: "4", title: "Menu Complet", description: "Entrée + Plat + Dessert + Vin", price: "55 000 FCFA", image: "" }], buttonText: "Réserver" }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 3),
      b("testimonials", { title: "Avis de nos convives", items: [{ id: "1", title: "Marie L.", description: "Une expérience inoubliable. Le meilleur restaurant de la ville !", rating: 5 }, { id: "2", title: "Jean-Claude D.", description: "Cuisine raffinée, service impeccable.", rating: 5 }, { id: "3", title: "Fatima Z.", description: "Le cadre est magnifique, les plats sont divins.", rating: 5 }, { id: "4", title: "Pierre A.", description: "Je recommande le menu dégustation, un voyage culinaire.", rating: 4 }] }, { padding: "80px 24px", backgroundColor: "#FEF2F2" }, 4),
      cta("Réservez votre table", "Du mardi au samedi, 12h-14h et 19h-22h", "Réserver maintenant", "#B91C1C", "#1A1110", "#FEF2F2", 5),
      b("contact", { title: "Nous trouver", description: "15 Avenue de la Liberté, Douala", buttonText: "Nous appeler", buttonUrl: "tel:+237612345678" }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 6),
      footer("© 2025 Restaurant Gastronomique", "#1A1110", "#FCA5A5", 7),
    ],
  },

  // ═══════ BOUTIQUE ═══════
  {
    id: "boutique-mode", name: "Boutique Mode", description: "Template e-commerce moderne inspiré de Cruip", category: "commerce", projectType: "catalogue", preview: "👗", tags: ["boutique", "mode", "ecommerce"], recommendedTheme: "luxe",
    blocks: [
      hero("Nouvelle Collection Été", "Boutique Exclusive", "Des pièces uniques pour sublimer votre style. Livraison gratuite dès 50 000 FCFA.", "Découvrir", "#D946EF", "#0F172A", "#ffffff", "120px 24px"),
      b("features", { title: "Pourquoi nous choisir", items: [{ id: "1", title: "Livraison Rapide", description: "Sous 48h partout en Afrique", icon: "🚚" }, { id: "2", title: "Paiement Sécurisé", description: "Orange Money, MTN, Carte bancaire", icon: "🔒" }, { id: "3", title: "Retour Gratuit", description: "Satisfait ou remboursé sous 14 jours", icon: "🔄" }, { id: "4", title: "Service Client", description: "Disponible 7j/7 par WhatsApp", icon: "💬" }] }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 1),
      b("products", { title: "Nos Best-Sellers", items: [{ id: "1", title: "Robe Florale", description: "Tissu léger, imprimé tropical", price: "25 000 FCFA", image: "" }, { id: "2", title: "Chemise Lin", description: "Coupe oversize, blanc cassé", price: "18 000 FCFA", image: "" }, { id: "3", title: "Sac en Raphia", description: "Fait main, anse en cuir", price: "15 000 FCFA", image: "" }, { id: "4", title: "Sandales Perles", description: "Cuir véritable, perles de couleur", price: "12 000 FCFA", image: "" }, { id: "5", title: "Pagne Wax", description: "Tissu traditionnel, motifs variés", price: "8 000 FCFA", image: "" }, { id: "6", title: "Boucles d'oreilles", description: "Or plaqué, perles d'eau douce", price: "6 000 FCFA", image: "" }], buttonText: "Ajouter au panier" }, { padding: "80px 24px", backgroundColor: "#FAF5FF" }, 2),
      b("testimonials", { title: "Avis client", items: [{ id: "1", title: "Esther K.", description: "Commande reçue en 2 jours, qualité incroyable !", rating: 5 }, { id: "2", title: "Mariam B.", description: "Ma nouvelle boutique préférée.", rating: 5 }] }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 3),
      b("social", { title: "Suivez-nous sur Instagram", socialLinks: [{ platform: "instagram", url: "https://instagram.com" }, { platform: "facebook", url: "https://facebook.com" }, { platform: "tiktok", url: "https://tiktok.com" }] }, { padding: "64px 24px", backgroundColor: "#F9FAFB" }, 4),
      cta("Inscrivez-vous à la newsletter", "Recevez -15% sur votre première commande.", "S'inscrire", "#D946EF", "#0F172A", "#ffffff", 5),
      footer("© 2025 Boutique Exclusive", "#0F172A", "#94a3b8", 6),
    ],
  },

  // ═══════ PHOTOGRAPHE ═══════
  {
    id: "photographe-portfolio", name: "Portfolio Photographe", description: "Template épuré style portfolio inspiré de HTML5 UP", category: "photographe", projectType: "portfolio", preview: "📷", tags: ["photographe", "portfolio", "art"], recommendedTheme: "portfolio",
    blocks: [
      hero("Capturer l'Instant", "Photographe Professionnel", "Chaque photo raconte une histoire unique. Spécialiste en portrait, mariage et événementiel.", "Voir le portfolio", "#8B5CF6", "#0F172A", "#ffffff", "160px 24px"),
      b("stats", { title: "Chiffres clés", stats: [{ label: "Shootings", value: "500+" }, { label: "Clients satisfaits", value: "98%" }, { label: "Années d'expérience", value: "10+" }, { label: "Pays visités", value: "15+" }] }, { padding: "64px 24px", backgroundColor: "#1E1B4B", textColor: "#ffffff" }, 1),
      b("gallery", { title: "Galerie", items: [{ id: "1", image: "", title: "Mariage" }, { id: "2", image: "", title: "Portrait" }, { id: "3", image: "", title: "Événement" }, { id: "4", image: "", title: "Nature" }, { id: "5", image: "", title: "Studio" }, { id: "6", image: "", title: "Street" }], columns: 3 }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 2),
      b("about", { title: "À propos", description: "Photographe depuis 2014, j'ai eu la chance de travailler avec des centaines de clients pour capturer leurs plus beaux moments. Mon style : naturel, élégant et authentique.", subtitle: "10 ans d'expérience", image: "" }, { padding: "80px 24px", backgroundColor: "#F5F3FF" }, 3),
      b("pricing", { title: "Mes offres", pricingPlans: [{ name: "Shooting Portrait", price: "35 000 FCFA", features: ["1h de shooting", "10 photos retouchées", "Galerie privée"], cta: "Réserver", highlight: false }, { name: "Mariage", price: "250 000 FCFA", features: ["Couverture complète", "300+ photos", "Album photo", "Teaser vidéo"], cta: "Me contacter", highlight: true }, { name: "Événement", price: "150 000 FCFA", features: ["4h de couverture", "100+ photos", "Retouches incluses"], cta: "Réserver", highlight: false }] }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 4),
      cta("Réservez votre shooting", "Offrez-vous des souvenirs inoubliables.", "Prendre rendez-vous", "#8B5CF6", "#0F172A", "#ffffff", 5),
      footer("© 2025 Portfolio Photographe", "#0F172A", "#94a3b8", 6),
    ],
  },

  // ═══════ COIFFEUR ═══════
  {
    id: "coiffeur-salon", name: "Salon de Coiffure", description: "Template moderne pour salons de coiffure et barbiers", category: "coiffeur", projectType: "minisite", preview: "💇", tags: ["coiffeur", "salon", "barbier", "beauté"], recommendedTheme: "boutique",
    blocks: [
      hero("Votre Style, Notre Passion", "Salon de Coiffure", "Expert en coiffure afro, tresses, locks et barbe. Des professionnels à votre service.", "Prendre RDV", "#0EA5E9", "#0C4A6E", "#ffffff", "120px 24px"),
      b("services", { title: "Nos Services", items: [{ id: "1", title: "Coupe & Coiffage", description: "Coupe tendance adaptée à votre morphologie", icon: "✂️" }, { id: "2", title: "Tresses & Vanilles", description: "Toutes sortes de tresses africaines", icon: "💁🏾‍♀️" }, { id: "3", title: "Barbe", description: "Taille, soin et rasage traditionnel", icon: "🧔" }, { id: "4", title: "Locks & Dreadlocks", description: "Pose, entretien et retouches", icon: "🦱" }, { id: "5", title: "Soins Capillaires", description: "Traitement des cheveux naturels", icon: "🧴" }, { id: "6", title: "Pose de Perruques", description: "Perruques de qualité supérieure", icon: "👩‍🦰" }] }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 1),
      b("gallery", { title: "Nos Réalisations", items: [{ id: "1", image: "", title: "Coupe" }, { id: "2", image: "", title: "Tresses" }, { id: "3", image: "", title: "Barbe" }, { id: "4", image: "", title: "Locks" }, { id: "5", image: "", title: "Soin" }, { id: "6", image: "", title: "Perruque" }], columns: 3 }, { padding: "80px 24px", backgroundColor: "#F0F9FF" }, 2),
      b("products", { title: "Produits Recommandés", items: [{ id: "1", title: "Huile de Ricin", description: "100% naturelle pour la pousse", price: "5 000 FCFA", image: "" }, { id: "2", title: "Beurre de Karité", description: "Hydratation intense", price: "3 500 FCFA", image: "" }, { id: "3", title: "Shampoing Bio", description: "Sans sulfate ni silicone", price: "4 500 FCFA", image: "" }], buttonText: "Commander" }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 3),
      b("testimonials", { title: "Avis client", items: [{ id: "1", title: "Aïcha D.", description: "Meilleur salon de coiffure de la ville. Je suis toujours satisfaite !", rating: 5 }, { id: "2", title: "Moussa K.", description: "La coupe barbe parfaite. Service impeccable.", rating: 5 }, { id: "3", title: "Rebecca N.", description: "Mes tresses tiennent depuis 3 semaines, incroyable !", rating: 5 }] }, { padding: "64px 24px", backgroundColor: "#F0F9FF" }, 4),
      cta("Réservez votre rendez-vous", "Du lundi au samedi, 9h-19h. Sans rendez-vous acceptés.", "Prendre RDV", "#0EA5E9", "#0C4A6E", "#ffffff", 5),
      footer("© 2025 Salon de Coiffure", "#0C4A6E", "#BAE6FD", 6),
    ],
  },

  // ═══════ MÉDECIN ═══════
  {
    id: "medecin-cabinet", name: "Cabinet Médical", description: "Template professionnel pour médecins et cabinets", category: "medecin", projectType: "minisite", preview: "⚕️", tags: ["médecin", "cabinet", "santé"], recommendedTheme: "business",
    blocks: [
      hero("Votre Santé, Notre Priorité", "Cabinet Médical", "Une équipe de professionnels de santé dédiée à votre bien-être.", "Prendre RDV", "#059669", "#064E3B", "#ffffff", "120px 24px"),
      b("about", { title: "Notre Cabinet", description: "Le Cabinet Médical de la Rue Principale vous accueille du lundi au vendredi. Notre équipe de 5 médecins généralistes et 3 spécialistes est là pour vous soigner avec attention et professionnalisme.", subtitle: "10 ans d'excellence", image: "" }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 1),
      b("services", { title: "Nos Spécialités", items: [{ id: "1", title: "Médecine Générale", description: "Consultations, suivi, prescriptions", icon: "🩺" }, { id: "2", title: "Pédiatrie", description: "Soins pour enfants et nourrissons", icon: "👶" }, { id: "3", title: "Cardiologie", description: "Problèmes cardiaques", icon: "❤️" }, { id: "4", title: "Dermatologie", description: "Peau, cheveux, ongles", icon: "🔬" }, { id: "5", title: "Gynécologie", description: "Santé de la femme", icon: "👩‍⚕️" }, { id: "6", title: "Analyses", description: "Laboratoire sur place", icon: "🧪" }] }, { padding: "80px 24px", backgroundColor: "#F0FDF4" }, 2),
      b("stats", { title: "Le cabinet en chiffres", stats: [{ label: "Patients", value: "15 000+" }, { label: "Médecins", value: "8" }, { label: "Années d'existence", value: "10+" }, { label: "Spécialités", value: "6" }] }, { padding: "64px 24px", backgroundColor: "#064E3B", textColor: "#ffffff" }, 3),
      cta("Prenez rendez-vous en ligne", "Consultations du lundi au vendredi, 8h-18h.", "Réserver", "#059669", "#064E3B", "#ffffff", 4),
      b("contact", { title: "Nous contacter", description: "12 Boulevard de l'Hôpital, Yaoundé", buttonText: "Appeler", buttonUrl: "tel:+237612345679" }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 5),
      footer("© 2025 Cabinet Médical", "#064E3B", "#6EE7B7", 6),
    ],
  },

  // ═══════ COACH / CONSULTANT ═══════
  {
    id: "coach-business", name: "Coach & Consultant", description: "Template premium pour coaches en développement personnel et business", category: "consultant", projectType: "landing", preview: "🎯", tags: ["coach", "consultant", "business", "formation"], recommendedTheme: "business",
    blocks: [
      hero("Transformez votre vie", "Coach Certifié", "Accompagnement personnalisé pour atteindre vos objectifs personnels et professionnels.", "Réserver un appel", "#F59E0B", "#1C1917", "#FEF3C7", "140px 24px"),
      b("about", { title: "Qui suis-je", description: "Coach certifié avec 8 ans d'expérience, j'ai accompagné plus de 500 personnes à transformer leur vie. Ma méthode : un mélange de coaching cognitif, de PNL et de techniques de développement personnel.", subtitle: "Votre guide vers la réussite", image: "" }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 1),
      b("features", { title: "Mes Accompagnements", items: [{ id: "1", title: "Coaching Individuel", description: "Séances 1-1 personnalisées", icon: "👤" }, { id: "2", title: "Programme de Groupe", description: "Ateliers en petit comité", icon: "👥" }, { id: "3", title: "Formation en Ligne", description: "Modules vidéo accessibles 24/7", icon: "🎥" }, { id: "4", title: "Conférences", description: "Interventions en entreprise", icon: "🎤" }] }, { padding: "80px 24px", backgroundColor: "#FFFBEB" }, 2),
      b("stats", { title: "Résultats", stats: [{ label: "Clients accompagnés", value: "500+" }, { label: "Taux de satisfaction", value: "99%" }, { label: "Sessions réalisées", value: "3 000+" }, { label: "Conférences", value: "50+" }] }, { padding: "64px 24px", backgroundColor: "#1C1917", textColor: "#FEF3C7" }, 3),
      b("testimonials", { title: "Témoignages", items: [{ id: "1", title: "Paul B.", description: "Grâce à ce coaching, j'ai lancé mon entreprise en 3 mois.", rating: 5 }, { id: "2", title: "Sarah D.", description: "Un accompagnement qui change la vie. Je recommande !", rating: 5 }, { id: "3", title: "Marc T.", description: "J'ai doublé mon chiffre d'affaires après 6 séances.", rating: 5 }] }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 4),
      cta("Offrez-vous un appel découverte", "30 minutes offertes pour parler de vos objectifs.", "Réserver mon appel", "#F59E0B", "#1C1917", "#FEF3C7", 5),
      footer("© 2025 Coach & Consultant", "#1C1917", "#FDE68A", 6),
    ],
  },

  // ═══════ ARTISAN ═══════
  {
    id: "artisan-premium", name: "Artisan d'Art", description: "Template artisanal pour mettre en valeur le savoir-faire", category: "artisan", projectType: "catalogue", preview: "🔨", tags: ["artisan", "savoir-faire", "création"], recommendedTheme: "boutique",
    blocks: [
      hero("L'Art de la Main", "Artisan Créateur", "Des pièces uniques façonnées avec passion. Le savoir-faire traditionnel au service de la modernité.", "Découvrir mes créations", "#D97706", "#1C1917", "#FFFBEB", "120px 24px"),
      b("text", { title: "Mon Histoire", description: "Artisan depuis 20 ans, je perpétue la tradition du travail du bois et du métal. Chaque pièce est unique et raconte une histoire. Je crée sur mesure pour les particuliers et les professionnels.", subtitle: "20 ans de passion" }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 1),
      b("gallery", { title: "Mes Créations", items: [{ id: "1", image: "", title: "Table en acajou" }, { id: "2", image: "", title: "Lampe en fer forgé" }, { id: "3", image: "", title: "Chaise sculptée" }, { id: "4", image: "", title: "Porte en bois massif" }, { id: "5", image: "", title: "Bijoux en argent" }, { id: "6", image: "", title: "Sculpture moderne" }], columns: 3 }, { padding: "80px 24px", backgroundColor: "#FFFBEB" }, 2),
      b("products", { title: "Pièces Disponibles", items: [{ id: "1", title: "Table Basse", description: "Bois de iroko massif", price: "150 000 FCFA", image: "" }, { id: "2", title: "Lampe d'atelier", description: "Fer forgé et laiton", price: "45 000 FCFA", image: "" }, { id: "3", title: "Bracelet Cuir", description: "Cuir tanné végétal", price: "12 000 FCFA", image: "" }, { id: "4", title: "Masque mural", description: "Bois de wengé sculpté", price: "35 000 FCFA", image: "" }], buttonText: "Commander" }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 3),
      cta("Commandez une pièce unique", "Sur mesure, selon vos envies.", "Me contacter", "#D97706", "#1C1917", "#FFFBEB", 4),
      footer("© 2025 Artisan d'Art", "#1C1917", "#FDE68A", 5),
    ],
  },

  // ═══════ GARAGE ═══════
  {
    id: "garage-premium", name: "Garage Auto Premium", description: "Template pro pour garages et mécaniciens", category: "garage", projectType: "minisite", preview: "🔧", tags: ["garage", "auto", "mécanique"], recommendedTheme: "business",
    blocks: [
      hero("Votre Voiture Entre de Bonnes Mains", "Garage Auto Premium", "Mécaniciens experts, diagnostic gratuit, véhicule de prêt.", "Prendre RDV", "#2563EB", "#0F172A", "#ffffff", "120px 24px"),
      b("services", { title: "Nos Services", items: [{ id: "1", title: "Diagnostic", description: "Diagnostic électronique complet", icon: "🔍" }, { id: "2", title: "Réparation Moteur", description: "Moteurs essence et diesel", icon: "⚙️" }, { id: "3", title: "Entretien Courant", description: "Vidange, freins, courroie", icon: "🛞" }, { id: "4", title: "Climatisation", description: "Révision et recharge", icon: "❄️" }, { id: "5", title: "Carrosserie", description: "Peinture, tôlerie, rénovation", icon: "🚗" }, { id: "6", title: "Pneumatiques", description: "Vente et montage de pneus", icon: "🔩" }] }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 1),
      b("testimonials", { title: "Avis clients", items: [{ id: "1", title: "Robert K.", description: "Service rapide et professionnel. Diagnostic gratuit, prix honnêtes.", rating: 5 }, { id: "2", title: "Christine M.", description: "Je confie ma voiture au Garage Auto Premium depuis 5 ans. Jamais déçue !", rating: 5 }] }, { padding: "64px 24px", backgroundColor: "#EFF6FF" }, 2),
      cta("Devis gratuit sous 24h", "Contactez-nous pour un diagnostic personnalisé.", "Demander un devis", "#2563EB", "#0F172A", "#ffffff", 3),
      b("contact", { title: "Nous trouver", description: "45 Rue du Garage, Zone Industrielle, Douala", buttonText: "Nous appeler", buttonUrl: "tel:+237612345680" }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 4),
      footer("© 2025 Garage Auto Premium", "#0F172A", "#93C5FD", 5),
    ],
  },

  // ═══════ CRÉATEUR DE CONTENU ═══════
  {
    id: "createur-contenu", name: "Créateur de Contenu", description: "Template moderne pour influenceurs et créateurs de contenu", category: "portfolio", projectType: "portfolio", preview: "📱", tags: ["créateur", "influenceur", "tiktok", "instagram"], recommendedTheme: "creatif",
    blocks: [
      hero("Créez l'Impact", "Créateur de Contenu", "Je crée du contenu authentique qui connecte et inspire. +200K abonnés sur les réseaux.", "Travailler ensemble", "#EC4899", "#0F172A", "#ffffff", "120px 24px"),
      b("stats", { title: "Ma communauté", stats: [{ label: "Instagram", value: "85K" }, { label: "TikTok", value: "120K" }, { label: "YouTube", value: "45K" }, { label: "Vues/mois", value: "2M+" }] }, { padding: "64px 24px", backgroundColor: "#1E1B4B", textColor: "#ffffff" }, 1),
      b("features", { title: "Collaborations", items: [{ id: "1", title: "Pubs & Sponsors", description: "Contenu sponsorisé authentique", icon: "📹" }, { id: "2", title: "Unboxing & Tests", description: "Reviews produits détaillés", icon: "📦" }, { id: "3", title: "Prise de Parole", description: "Événements et conférences", icon: "🎤" }, { id: "4", title: "Formation", description: "Stratégie réseaux sociaux", icon: "📈" }] }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 2),
      b("gallery", { title: "Dernières Créations", items: [{ id: "1", image: "", title: "Vidéo TikTok" }, { id: "2", image: "", title: "Post Instagram" }, { id: "3", image: "", title: "Shooting Photo" }, { id: "4", image: "", title: "Collaboration" }], columns: 2 }, { padding: "80px 24px", backgroundColor: "#FDF2F8" }, 3),
      b("social", { title: "Mes Réseaux", socialLinks: [{ platform: "instagram", url: "https://instagram.com" }, { platform: "tiktok", url: "https://tiktok.com" }, { platform: "youtube", url: "https://youtube.com" }] }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 4),
      cta("Travaillons ensemble", "Collaborez avec moi pour toucher une audience jeune et engagée.", "Me contacter", "#EC4899", "#0F172A", "#ffffff", 5),
      footer("© 2025 Créateur de Contenu", "#0F172A", "#94a3b8", 6),
    ],
  },

  // ═══════ ÉGLISE / ASSOCIATION ═══════
  {
    id: "eglise-association", name: "Église & Association", description: "Template sobre pour églises, associations et ONG", category: "formation", projectType: "minisite", preview: "⛪", tags: ["église", "association", "ong", "communauté"], recommendedTheme: "business",
    blocks: [
      hero("Ensemble, Bâtissons un Monde Meilleur", "Association Espoir", "Depuis 2015, nous agissons pour l'éducation et la solidarité.", "Nous soutenir", "#D97706", "#1C1917", "#FEF3C7", "120px 24px"),
      b("about", { title: "Notre Mission", description: "L'Association Espoir œuvre depuis 10 ans pour offrir une éducation de qualité aux enfants défavorisés et soutenir les familles dans le besoin. Nous croyons en un monde où chaque enfant a accès à l'éducation.", subtitle: "10 ans de solidarité", image: "" }, { padding: "80px 24px", backgroundColor: "#ffffff" }, 1),
      b("stats", { title: "Notre impact", stats: [{ label: "Enfants scolarisés", value: "2 500+" }, { label: "Familles aidées", value: "1 200+" }, { label: "Bénévoles actifs", value: "150+" }, { label: "Projets réalisés", value: "30+" }] }, { padding: "64px 24px", backgroundColor: "#1C1917", textColor: "#FEF3C7" }, 2),
      b("gallery", { title: "Nos Actions", items: [{ id: "1", image: "", title: "Distribution de fournitures" }, { id: "2", image: "", title: "Construction d'école" }, { id: "3", image: "", title: "Campagne de sensibilisation" }, { id: "4", image: "", title: "Visite aux familles" }, { id: "5", image: "", title: "Atelier éducatif" }, { id: "6", image: "", title: "Remise de bourses" }], columns: 3 }, { padding: "80px 24px", backgroundColor: "#FFFBEB" }, 3),
      b("testimonials", { title: "Témoignages", items: [{ id: "1", title: "Marie Z.", description: "Grâce à l'association, mon fils a pu retourner à l'école.", rating: 5 }, { id: "2", title: "Paul K.", description: "Je suis bénévole depuis 3 ans, une expérience enrichissante.", rating: 5 }] }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 4),
      cta("Faites un don", "Chaque geste compte pour construire un avenir meilleur.", "Faire un don", "#D97706", "#1C1917", "#FEF3C7", 5),
      b("contact", { title: "Nous contacter", description: "Rejoignez notre cause", buttonText: "Nous écrire" }, { padding: "64px 24px", backgroundColor: "#ffffff" }, 6),
      footer("© 2025 Association Espoir - Ensemble, construisons l'avenir", "#1C1917", "#FDE68A", 7),
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