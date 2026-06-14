"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TemplateSelector from "@/components/templates/TemplateSelector";
import type { Template } from "@/lib/templates/types";

// ─── Données ─────────────────────────────────────────────
const projectTypes = [
  { id: "landing", icon: "📄", title: "Landing Page", description: "Page optimisée pour convertir vos visiteurs en clients." },
  { id: "catalogue", icon: "📦", title: "Catalogue Professionnel", description: "Présentez vos produits et services avec un rendu haut de gamme." },
  { id: "funnel", icon: "🔀", title: "Funnel Marketing", description: "Construisez des parcours qui transforment les visiteurs en clients." },
  { id: "minisite", icon: "🌐", title: "Mini Site Web", description: "Une présence professionnelle sans développement." },
  { id: "portfolio", icon: "🎨", title: "Portfolio", description: "Mettez en valeur vos réalisations avec un rendu élégant." },
  { id: "reservation", icon: "📅", title: "Page de Réservation", description: "Permettez à vos clients de réserver en ligne." },
];

const languages = [
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "en", label: "Anglais", flag: "🇬🇧" },
  { id: "es", label: "Espagnol", flag: "🇪🇸" },
  { id: "pt", label: "Portugais", flag: "🇧🇷" },
  { id: "ar", label: "Arabe", flag: "🇸🇦" },
  { id: "de", label: "Allemand", flag: "🇩🇪" },
  { id: "it", label: "Italien", flag: "🇮🇹" },
];

const categories = [
  { id: "commerce", icon: "🛍️", name: "Commerce" },
  { id: "restaurant", icon: "🍽️", name: "Restaurant" },
  { id: "photographe", icon: "📷", name: "Photographe" },
  { id: "graphiste", icon: "🎨", name: "Graphiste" },
  { id: "medecin", icon: "⚕️", name: "Médecin" },
  { id: "garage", icon: "🔧", name: "Garage" },
  { id: "styliste", icon: "👗", name: "Styliste" },
  { id: "consultant", icon: "💼", name: "Consultant" },
  { id: "artisan", icon: "🔨", name: "Artisan" },
  { id: "immobilier", icon: "🏠", name: "Immobilier" },
  { id: "autre", icon: "✨", name: "Autre" },
];

const TOTAL_STEPS = 6;

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || `projet-${uuidv4().slice(0, 8)}`;
}

// ─── Animations ──────────────────────────────────────────
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

// ─── Page ─────────────────────────────────────────────────
export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const [form, setForm] = useState({
    type: "",
    language: "fr",
    category: "",
    name: "",
    description: "",
    phone: "",
    whatsapp: "",
    address: "",
    email: "",
  });

  const goNext = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const goPrev = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!form.type;
      case 2: return !!form.language;
      case 3: return !!form.category;
      case 4: return true; // template optional
      case 5: return !!form.name;
      case 6: return true;
      default: return false;
    }
  };

  const createProject = useCallback(async () => {
    setLoading(true);
    const editToken = uuidv4();
    const slug = generateSlug(form.name || "projet");

    // Construire les données en n'envoyant que les champs qui existent
    const insertData: any = {
      name: form.name,
      whatsapp: form.whatsapp,
      description: form.description,
      edit_token: editToken,
      slug: slug,
      is_paid: false,
    };

    // Ajouter les champs optionnels seulement s'ils ne sont pas vides
    if (form.type) insertData.type = form.type;
    if (form.language) insertData.language = form.language;
    if (form.category) insertData.category = form.category;
    if (form.phone) insertData.phone = form.phone;
    if (form.email) insertData.email = form.email;
    if (form.address) insertData.address = form.address;

    // Ajouter les blocs du template sélectionné
    if (selectedTemplate) {
      insertData.blocks = JSON.stringify(selectedTemplate.blocks);
    }

    const { data, error } = await supabase
      .from("catalogs")
      .insert(insertData)
      .select()
      .single();

    setLoading(false);

    if (error || !data) {
      console.error("Erreur création:", error);
      return;
    }

    router.push(`/edit/${editToken}`);
  }, [form, router]);

  return (
    <main className="min-h-screen bg-white text-[#0F172A] font-['Inter',sans-serif]">

      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Vistalink</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 transition"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </header>

      {/* ═══════════════════ PROGRESS BAR ═══════════════════ */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400">
              Étape {step} sur {TOTAL_STEPS}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* ═══════════════════ CONTENT ═══════════════════ */}
      <div className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Hero compact */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Créer votre projet
              </h1>
              <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
                Créez une landing page, un catalogue professionnel, un funnel ou un mini site web en quelques minutes.
              </p>
            </motion.div>
          )}

          {/* Step content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* ─── ÉTAPE 1 : Type de projet ─── */}
              {step === 1 && (
                <div className="grid md:grid-cols-2 gap-4">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setForm({ ...form, type: type.id })}
                      className={`text-left p-6 rounded-2xl border-2 transition-all duration-300 group ${
                        form.type === type.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                      }`}
                    >
                      <div className="text-3xl mb-3">{type.icon}</div>
                      <h3 className="font-bold text-lg mb-1">{type.title}</h3>
                      <p className="text-gray-500 text-sm">{type.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* ─── ÉTAPE 2 : Langue ─── */}
              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-extrabold mb-2">Choisissez la langue</h2>
                  <p className="text-gray-500 mb-8">La langue de votre page sera celle de vos visiteurs.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setForm({ ...form, language: lang.id })}
                        className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                          form.language === lang.id
                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="text-3xl mb-2">{lang.flag}</div>
                        <p className="font-semibold">{lang.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── ÉTAPE 3 : Catégorie ─── */}
              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-extrabold mb-2">Quelle est votre activité ?</h2>
                  <p className="text-gray-500 mb-8">Choisissez la catégorie qui correspond le mieux à votre activité.</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setForm({ ...form, category: cat.id })}
                        className={`text-center p-5 rounded-2xl border-2 transition-all duration-300 group ${
                          form.category === cat.id
                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                            : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                        }`}
                      >
                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
                        <p className="font-semibold text-sm">{cat.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ─── ÉTAPE 4 : Template ─── */}
              {step === 4 && (
                <TemplateSelector
                  selectedCategory={form.category}
                  selectedTemplate={selectedTemplate?.id || ""}
                  onSelect={(t) => setSelectedTemplate(t)}
                />
              )}

              {/* ─── ÉTAPE 5 : Informations ─── */}
              {step === 5 && (
                <div>
                  <h2 className="text-2xl font-extrabold mb-2">Vos informations</h2>
                  <p className="text-gray-500 mb-8">Remplissez les informations de votre projet.</p>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du projet *</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Ex: Mon Business"
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                      <textarea
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        placeholder="Décrivez votre activité en quelques mots..."
                        rows={3}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+237 6XX XXX XXX"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp</label>
                        <input
                          type="tel"
                          value={form.whatsapp}
                          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                          placeholder="2376XXXXXXXX"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="contact@monbusiness.com"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                        <input
                          type="text"
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          placeholder="Ville, Pays"
                          className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ─── ÉTAPE 6 : Médias ─── */}
              {step === 6 && (
                <div>
                  <h2 className="text-2xl font-extrabold mb-2">Ajoutez vos médias</h2>
                  <p className="text-gray-500 mb-8">Vous pourrez toujours modifier ces éléments plus tard dans l'éditeur.</p>

                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                        <span className="text-3xl">🖼️</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2">Ajoutez vos images et vidéos</h3>
                      <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                        Vous pourrez ajouter des images et vidéos directement dans l'éditeur après la création du projet.
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
                          📁 Galerie
                        </span>
                        <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
                          📷 Photo
                        </span>
                        <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
                          🎬 Vidéo
                        </span>
                        <span className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm font-medium">
                          🔗 URL
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-gray-400 mt-4">
                    💡 Les médias seront ajoutés dans l'éditeur après la création.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* ═══════════════════ NAVIGATION ═══════════════════ */}
          <div className="mt-12 flex items-center justify-between">
            {step > 1 ? (
              <button
                onClick={goPrev}
                className="px-6 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition rounded-full border border-gray-200 hover:border-gray-300"
              >
                ← Précédent
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className={`px-8 py-3.5 rounded-full text-sm font-semibold transition shadow-sm ${
                  canProceed()
                    ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={createProject}
                disabled={loading}
                className="px-8 py-3.5 rounded-full text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition shadow-lg shadow-emerald-200 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </span>
                ) : (
                  "Créer le projet →"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}