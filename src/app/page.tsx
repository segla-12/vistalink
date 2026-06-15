import Link from "next/link";
import Image from "next/image";

// ─── Données ─────────────────────────────────────────────
const features = [
  {
    icon: "📄",
    image: "/images/homepage/feature-landing.jpg",
    title: "Landing Pages",
    description: "Créez des pages optimisées pour convertir vos visiteurs en clients.",
  },
  {
    icon: "🔀",
    image: "/images/homepage/feature-funnel.jpg",
    title: "Funnels Marketing",
    description: "Construisez des parcours simples qui transforment les visiteurs en clients.",
  },
  {
    icon: "📦",
    image: "/images/homepage/feature-catalog.jpg",
    title: "Catalogues Professionnels",
    description: "Présentez vos produits et services avec un rendu haut de gamme.",
  },
  {
    icon: "🌐",
    image: "/images/homepage/feature-minisite.jpg",
    title: "Mini Sites Web",
    description: "Disposez d'une présence professionnelle sans développement.",
  },
  {
    icon: "🎨",
    image: "/images/homepage/feature-portfolio.jpg",
    title: "Portfolio",
    description: "Mettez en valeur vos réalisations avec un rendu élégant.",
  },
  {
    icon: "📱",
    image: "/images/homepage/feature-qr.jpg",
    title: "QR Codes et Partage",
    description: "Partagez vos créations en quelques secondes sur tous les réseaux.",
  },
];

const categories = [
  { name: "Restaurant", emoji: "🍽️", image: "/images/homepage/cat-restaurant.jpg" },
  { name: "Photographe", emoji: "📷", image: "/images/homepage/cat-photographer.jpg" },
  { name: "Graphiste", emoji: "🎨", image: "/images/homepage/cat-graphiste.jpg" },
  { name: "Immobilier", emoji: "🏠", image: "/images/homepage/cat-immobilier.jpg" },
  { name: "Médecin", emoji: "⚕️", image: "/images/homepage/cat-medecin.jpg" },
  { name: "Garage", emoji: "🔧", image: "/images/homepage/cat-garage.jpg" },
  { name: "Styliste", emoji: "👗", image: "/images/homepage/cat-styliste.jpg" },
  { name: "Commerce", emoji: "🛍️", image: "/images/homepage/cat-commerce.jpg" },
  { name: "Consultant", emoji: "💼", image: "/images/homepage/cat-consultant.jpg" },
  { name: "Artisan", emoji: "🔨", image: "/images/homepage/cat-artisan.jpg" },
];

const steps = [
  { num: "1", title: "Choisissez un modèle", description: "Sélectionnez un template adapté à votre activité." },
  { num: "2", title: "Ajoutez votre contenu", description: "Personnalisez texte, images et vidéos en quelques clics." },
  { num: "3", title: "Publiez votre projet", description: "Votre page est en ligne instantanément." },
  { num: "4", title: "Partagez votre lien", description: "Envoyez votre URL ou QR Code à vos clients." },
];

const testimonials = [
  {
    name: "Aminata K.",
    role: "Commerçante, Douala",
    text: "J'ai créé mon catalogue en 3 minutes. Mes clients adorent le rendu et je reçois plus de commandes sur WhatsApp.",
    image: "/images/homepage/testimonial-1.jpg",
  },
  {
    name: "Jean-Pierre M.",
    role: "Photographe, Yaoundé",
    text: "Enfin un outil simple pour présenter mon portfolio. Le résultat est vraiment professionnel.",
    image: "/images/homepage/testimonial-2.jpg",
  },
  {
    name: "Fatima B.",
    role: "Styliste, Paris",
    text: "Je partage mon lien Vistalink sur Instagram et TikTok. Mes clientes peuvent voir toute ma collection.",
    image: "/images/homepage/testimonial-3.jpg",
  },
];

// ─── Page ─────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-[#0F172A] font-['Inter',sans-serif]">

      {/* ═══════════════════ HEADER ═══════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/vistalink-logo.png"
              alt="Vistalink"
              width={32}
              height={32}
              className="h-8 w-8 rounded-lg object-contain"
              priority
            />
            <span className="font-bold text-lg tracking-tight">Vistalink</span>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition">Fonctionnalités</a>
            <a href="#templates" className="hover:text-gray-900 transition">Modèles</a>
            <Link href="/dashboard" className="hover:text-gray-900 transition">Mes projets</Link>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 hover:text-gray-900 transition md:hidden"
            >
              Mes projets
            </Link>
            <Link
              href="/create"
              className="bg-[#0F172A] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
            >
              Commencer
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Texte */}
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 border border-emerald-100">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Plateforme de création de pages
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
                Créez des pages professionnelles{" "}
                <span className="text-emerald-600">qui convertissent.</span>
              </h1>

              <p className="mt-6 text-lg text-gray-500 leading-relaxed max-w-xl">
                Landing pages, catalogues, tunnels marketing et mini sites web dans une seule plateforme.
                Sans coder. En quelques minutes.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/create"
                  className="bg-emerald-600 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition shadow-lg shadow-emerald-200"
                >
                  Créer un projet
                </Link>
                <a
                  href="#demo"
                  className="border border-gray-200 text-gray-700 px-8 py-4 rounded-full text-base font-semibold hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  Voir un exemple
                </a>
              </div>
            </div>

            {/* Mockup */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <Image
                  src="/images/homepage/hero-laptop.jpg"
                  alt="Vistalink - Plateforme de création de pages professionnelles"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-cover"
                  priority
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Decorative blobs */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-100 rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Tout ce dont vous avez besoin pour présenter, vendre et développer votre activité.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 group overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-xl flex items-center justify-center text-xl shadow-sm">
                    {f.icon}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TEMPLATES ═══════════════════ */}
      <section id="templates" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Des modèles conçus pour tous les métiers.
            </h2>
            <p className="mt-4 text-gray-500">
              Choisissez un template et personnalisez-le selon vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="relative rounded-2xl overflow-hidden border border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all duration-300 cursor-pointer group aspect-[3/4]"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={600}
                  height={800}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Créez sans coder.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="text-center relative">
                {/* Ligne de connexion */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] right-[-40%] h-px bg-gray-200" />
                )}
                <div className="w-16 h-16 bg-white border-2 border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 shadow-sm">
                  <span className="text-emerald-600 font-bold text-xl">{step.num}</span>
                </div>
                <h3 className="font-bold mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ MOBILE ═══════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Pensé pour le partage mobile.
              </h2>
              <p className="mt-6 text-gray-500 text-lg leading-relaxed">
                Toutes les créations sont optimisées pour mobile. Idéal pour les utilisateurs qui partagent leurs pages sur WhatsApp, Facebook, Instagram et TikTok.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["WhatsApp", "Facebook", "Instagram", "TikTok"].map((name) => (
                  <span
                    key={name}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex justify-center">
              <div className="relative w-[320px]">
                <div className="bg-[#0F172A] rounded-[3rem] p-3 shadow-2xl">
                  <div className="bg-white rounded-[2.2rem] overflow-hidden">
                    <div className="h-6 bg-gray-100 flex items-center justify-center">
                      <div className="w-20 h-1.5 bg-gray-300 rounded-full" />
                    </div>
                    <Image
                      src="/images/homepage/mobile-phone.jpg"
                      alt="Vistalink sur mobile"
                      width={600}
                      height={900}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
                {/* Floating social icons */}
                <div className="absolute -right-4 top-1/4 bg-white rounded-xl shadow-lg p-2">
                  <Image
                    src="/images/homepage/mobile-social.jpg"
                    alt="Partage social"
                    width={80}
                    height={80}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ils nous font confiance.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-7 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={t.image}
                      alt={t.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA ═══════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Prêt à créer votre prochaine page professionnelle ?
          </h2>
          <p className="mt-4 text-gray-500 text-lg">
            Aucune carte bancaire requise. Commencez gratuitement.
          </p>
          <Link
            href="/create"
            className="inline-block mt-10 bg-emerald-600 text-white px-10 py-4 rounded-full text-base font-semibold hover:bg-emerald-500 transition shadow-lg shadow-emerald-200"
          >
            Commencer gratuitement
          </Link>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
          © 2025 Vistalink. Tous droits réservés.
        </div>
      </footer>
    </main>
  );
}