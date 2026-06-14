// ─── Types de blocs supportés ─────────────────────────
export const BLOCK_TYPES = [
  "hero",
  "gallery",
  "products",
  "services",
  "about",
  "testimonials",
  "stats",
  "pricing",
  "contact",
  "map",
  "social",
  "qrcode",
  "video",
  "form",
  "countdown",
  "cta",
  "header",
  "footer",
  "faq",
  "features",
  "team",
  "logos",
  "text",
  "image",
  "divider",
  "embed",
] as const;

export type BlockType = (typeof BLOCK_TYPES)[number];

// ─── Style d'un bloc ────────────────────────────────────
export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  paddingMobile?: string;
  maxWidth?: string;
  borderRadius?: string;
  shadow?: string;
  gradient?: string;
  customCss?: string;
}

// ─── Contenu d'un bloc (union par type) ─────────────────
export interface BlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  video?: string;
  icon?: string;
  link?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonColor?: string;
  items?: BlockContentItem[];
  columns?: number;
  layout?: "left" | "center" | "right" | "split";
  fullWidth?: boolean;
  overlay?: boolean;
  rating?: number;
  stats?: { label: string; value: string }[];
  socialLinks?: { platform: string; url: string }[];
  formFields?: { type: string; label: string; required: boolean }[];
  faqItems?: { question: string; answer: string }[];
  teamMembers?: { name: string; role: string; photo?: string }[];
  logos?: { src: string; alt: string; url?: string }[];
  embedCode?: string;
  countdownDate?: string;
  pricingPlans?: {
    name: string;
    price: string;
    features: string[];
    cta: string;
    highlight?: boolean;
  }[];
  html?: string;
}

export interface BlockContentItem {
  id?: string;
  title?: string;
  description?: string;
  price?: string;
  image?: string;
  icon?: string;
  url?: string;
  features?: string[];
  rating?: number;
}

// ─── Bloc complet ───────────────────────────────────────
export interface Block {
  id: string;
  type: BlockType;
  content: BlockContent;
  styles: BlockStyles;
  order: number;
  visible: boolean;
}

// ─── Projet complet ─────────────────────────────────────
export type ProjectType =
  | "landing-page"
  | "catalogue"
  | "mini-site"
  | "portfolio"
  | "funnel"
  | "reservation"
  | "sales-page";

export type ProjectLanguage = "fr" | "en" | "es" | "pt" | "ar" | "de" | "it";

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  language: ProjectLanguage;
  blocks: Block[];
  globalStyles: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
  };
  meta: {
    title?: string;
    description?: string;
    slug?: string;
    favicon?: string;
    ogImage?: string;
  };
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  is_paid: boolean;
  edit_token: string;
  created_at: string;
  updated_at: string;
}

// ─── Métadonnées d'un type de bloc ──────────────────────
export interface BlockMeta {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
  category: "content" | "media" | "social" | "conversion" | "structure";
  defaultContent: BlockContent;
  defaultStyles: BlockStyles;
}