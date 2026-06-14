"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, useEffect, type ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────
export interface Product {
  id: string;
  title: string;
  description?: string;
  price?: string;
  image?: string;
  media_type?: string;
}

export interface Catalog {
  id: string;
  name: string;
  whatsapp?: string;
  phone?: string;
  email?: string;
  address?: string;
  description?: string;
  slug?: string;
  edit_token?: string;
  category?: string;
  hours?: string;
}

interface CatalogViewProps {
  catalog: Catalog;
  products: Product[];
  showQRCode?: boolean;
  previewBanner?: ReactNode;
}

// ─── Helpers ─────────────────────────────────────────────
const formatWhatsApp = (n: string) => n.replace(/[^0-9]/g, "");
const waLink = (n: string) => `https://wa.me/${formatWhatsApp(n)}`;

const easeOutExpo = [0.25, 0.46, 0.45, 0.94] as const;

// ─── Variants ────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo, delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.08 },
  }),
};

// ─── Icons (composants minimalistes) ─────────────────────
const IconPhone = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const IconMap = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

const IconClock = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const IconStar = ({ filled = true }: { filled?: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const IconWhatsApp = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconMail = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const IconArrowDown = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

// ─── Données par défaut avis ─────────────────────────────
const DEFAULT_REVIEWS = [
  { name: "Amadou Diallo", initial: "A", text: "Service exceptionnel ! Un professionnalisme rare. Je recommande les yeux fermés.", rating: 5 },
  { name: "Marie Koné", initial: "M", text: "Ravi du travail fourni. Délais respectés et qualité au rendez-vous.", rating: 5 },
  { name: "Khadija Traoré", initial: "K", text: "Une équipe à l'écoute et des prestations de grande qualité. Merci !", rating: 5 },
  { name: "Ibrahim Sissoko", initial: "I", text: "Je recommande vivement. Excellent rapport qualité-prix.", rating: 4 },
  { name: "Aminata Bâ", initial: "A", text: "Professionnel et fiable. Une belle découverte !", rating: 5 },
];

// ─── Section Avis ────────────────────────────────────────
function ReviewsSection({ name }: { name: string }) {
  return (
    <section className="relative py-24 px-5 md:px-8 overflow-hidden bg-gradient-to-b from-emerald-50/30 to-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-emerald-500/3 blur-3xl pointer-events-none" />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={0}
        >
          <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">Témoignages</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3 leading-tight">Ce que disent nos clients</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-base md:text-lg">La satisfaction de nos clients est notre plus belle récompense</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DEFAULT_REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              className="group bg-white rounded-2xl p-6 md:p-7 shadow-lg hover:shadow-xl transition-all duration-500 border border-emerald-100/50 hover:border-emerald-200 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i}
            >
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center opacity-50">
                <span className="text-emerald-600 text-lg font-serif leading-none">&ldquo;</span>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, s) => (<IconStar key={s} filled={s < r.rating} />))}
              </div>
              <p className="text-slate-600 leading-relaxed text-[15px]">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">{r.initial}</div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">Client satisfait</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section Contact ─────────────────────────────────────
function ContactSection({ catalog, waNum }: { catalog: Catalog; waNum: string }) {
  const link = waLink(waNum);
  return (
    <section className="relative py-24 px-5 md:px-8 bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-950 pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
          <span className="text-emerald-400 font-semibold text-xs tracking-[0.2em] uppercase">Contact</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 leading-tight">Prêt à collaborer&nbsp;?</h2>
          <p className="text-slate-400 mt-4 max-w-md mx-auto text-base">Discutons de votre projet. Une réponse rapide vous est garantie.</p>
        </motion.div>
        <motion.div className="mt-12 grid sm:grid-cols-2 gap-4 max-w-lg mx-auto" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
          <a href={`${link}?text=Bonjour%20${encodeURIComponent(catalog.name)}%2C%20je%20souhaite%20obtenir%20des%20informations.`} target="_blank" className="group flex items-center gap-4 bg-white/5 hover:bg-emerald-600/20 backdrop-blur-sm border border-white/10 hover:border-emerald-500/40 px-5 py-4 rounded-xl font-semibold text-white transition-all duration-300">
            <div className="w-11 h-11 rounded-lg bg-emerald-600/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-600/30 transition-colors"><IconWhatsApp className="w-5 h-5 text-emerald-400" /></div>
            <span className="text-sm md:text-base">WhatsApp</span>
          </a>
          <a href={`tel:${catalog.whatsapp}`} className="group flex items-center gap-4 bg-white/5 hover:bg-sky-600/20 backdrop-blur-sm border border-white/10 hover:border-sky-500/40 px-5 py-4 rounded-xl font-semibold text-white transition-all duration-300">
            <div className="w-11 h-11 rounded-lg bg-sky-600/20 flex items-center justify-center shrink-0 group-hover:bg-sky-600/30 transition-colors"><IconPhone /></div>
            <span className="text-sm md:text-base">Appeler</span>
          </a>
          {catalog.email && (
            <a href={`mailto:${catalog.email}`} className="group flex items-center gap-4 bg-white/5 hover:bg-violet-600/20 backdrop-blur-sm border border-white/10 hover:border-violet-500/40 px-5 py-4 rounded-xl font-semibold text-white transition-all duration-300 sm:col-span-2">
              <div className="w-11 h-11 rounded-lg bg-violet-600/20 flex items-center justify-center shrink-0 group-hover:bg-violet-600/30 transition-colors"><IconMail /></div>
              <span className="text-sm md:text-base">Envoyer un email</span>
            </a>
          )}
        </motion.div>
        {(catalog.address || catalog.hours) && (
          <motion.div className="mt-8 flex flex-wrap justify-center gap-6 text-slate-400 text-sm" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}>
            {catalog.address && <span className="flex items-center gap-2"><IconMap />{catalog.address}</span>}
            {catalog.hours && <span className="flex items-center gap-2"><IconClock />{catalog.hours}</span>}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Section QR Code ─────────────────────────────────────
function QRCodeSection({ catalog }: { catalog: Catalog }) {
  const [mounted, setMounted] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  useEffect(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    setQrUrl(`${baseUrl}/${catalog.slug}`);
    setMounted(true);
  }, [catalog.slug]);

  return (
    <section className="py-20 px-5 md:px-8 bg-[#F8FAFC]">
      <div className="max-w-md mx-auto">
        <motion.div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-slate-100 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}>
          <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Scannez pour accéder rapidement à ce catalogue</h3>
          <p className="text-slate-500 text-sm mb-6">Partagez ce catalogue en un instant</p>
          <div className="w-48 h-48 mx-auto bg-white rounded-2xl border-2 border-slate-100 p-3 shadow-inner flex items-center justify-center">
            {mounted && qrUrl ? (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
                  <rect x="0" y="0" width="100" height="100" rx="8" fill="white" />
                  <rect x="5" y="5" width="22" height="22" rx="3" fill="#0F172A" />
                  <rect x="8" y="8" width="16" height="16" rx="1.5" fill="white" />
                  <rect x="73" y="5" width="22" height="22" rx="3" fill="#0F172A" />
                  <rect x="76" y="8" width="16" height="16" rx="1.5" fill="white" />
                  <rect x="5" y="73" width="22" height="22" rx="3" fill="#0F172A" />
                  <rect x="8" y="76" width="16" height="16" rx="1.5" fill="white" />
                  {[40, 45, 50, 55, 60].flatMap(y =>
                    [30, 35, 40, 45, 50, 55, 60, 65].map(x => ({ x, y }))
                  ).filter((_, i) => i % 3 !== 0).map(({ x, y }, i) => (
                    <rect key={i} x={x} y={y} width="5" height="5" rx="1" fill="#0F172A" />
                  ))}
                </svg>
              </div>
            ) : (
              <div className="w-12 h-12 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
            )}
          </div>
          <p className="mt-5 text-xs text-slate-400">{qrUrl || "..."}</p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Component Principal ─────────────────────────────────
export default function CatalogView({ catalog, products, showQRCode = true, previewBanner }: CatalogViewProps) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);

  const firstImage = products.find((p) => p.image)?.image;
  const waNum = catalog.whatsapp?.replace(/[^0-9]/g, "") || "";
  const waLinkUrl = waLink(waNum);
  const galleryImages = products.filter((p) => p.image);

  const badgeText = catalog.whatsapp ? "Contacter sur WhatsApp" : "Demander un devis";

  return (
    <>
      {/* BANDEAU APERÇU (optionnel) */}
      {previewBanner}

      {/* ===== HERO SECTION ===== */}
      <header
        className="relative min-h-[100dvh] flex items-center justify-center text-white overflow-hidden"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%), url('${firstImage || ""}') center/cover no-repeat`,
          backgroundColor: firstImage ? "transparent" : "#0F172A",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        <motion.div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: easeOutExpo }}
        >
          <motion.div
            className="w-28 h-28 md:w-32 md:h-32 mx-auto rounded-full bg-white/10 backdrop-blur-lg border-2 border-white/30 mb-8 flex items-center justify-center text-5xl md:text-6xl shadow-2xl"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
          >
            {catalog.name.charAt(0).toUpperCase()}
          </motion.div>

          {catalog.category && (
            <motion.span
              className="inline-block text-sm text-white/70 tracking-[0.2em] uppercase mb-4 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {catalog.category}
            </motion.span>
          )}

          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {catalog.name}
          </motion.h1>

          {catalog.description && (
            <motion.p
              className="mt-5 text-base md:text-lg text-white/80 max-w-[700px] mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {catalog.description}
            </motion.p>
          )}

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.a
              href={`${waLinkUrl}?text=Bonjour%20${encodeURIComponent(catalog.name)}%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20vos%20services`}
              target="_blank"
              className="inline-flex items-center gap-3 bg-[#16A34A] hover:bg-emerald-500 text-white px-12 py-5 md:px-16 md:py-6 rounded-full text-lg md:text-xl font-bold shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 60px -10px rgba(22, 163, 74, 0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <IconWhatsApp className="w-6 h-6 md:w-7 md:h-7" />
              {badgeText}
            </motion.a>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-5 md:gap-8 text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {catalog.whatsapp && (
              <a href={`tel:${catalog.whatsapp}`} className="flex items-center gap-2 hover:text-white/90 transition-colors">
                <IconPhone />
                {catalog.whatsapp}
              </a>
            )}
            {catalog.address && (
              <span className="flex items-center gap-2"><IconMap />{catalog.address}</span>
            )}
            {catalog.hours && (
              <span className="flex items-center gap-2"><IconClock />{catalog.hours}</span>
            )}
          </motion.div>
        </motion.div>

        <motion.button
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => document.getElementById("offres")?.scrollIntoView({ behavior: "smooth" })}
        >
          <IconArrowDown />
        </motion.button>
      </header>

      {/* ===== SECTION OFFRES ===== */}
      {products.length > 0 && (
        <section id="offres" className="py-24 md:py-32 px-5 md:px-8 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16 md:mb-20" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
              <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">Nos offres</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mt-3 leading-tight">Ce que nous proposons</h2>
              <p className="text-[#64748B] mt-4 max-w-xl mx-auto text-base md:text-lg">Des prestations pensées pour répondre à vos besoins</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  className="group bg-white rounded-[24px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
                >
                  {p.image && (
                    <div className="relative h-[280px] overflow-hidden">
                      {p.media_type === "video" ? (
                        <video src={p.image} controls className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <button onClick={() => setLightbox(p.image || null)} className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/30">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  <div className="p-6 md:p-7">
                    <h3 className="text-xl md:text-2xl font-bold text-[#0F172A]">{p.title}</h3>
                    {p.description && <p className="text-[#64748B] mt-3 leading-relaxed text-base">{p.description}</p>}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                      {p.price && <span className="text-2xl font-extrabold text-[#16A34A]">{p.price}</span>}
                      <a href={`${waLinkUrl}?text=Bonjour%2C%20je%20suis%20int%C3%A9ress%C3%A9%20par%20${encodeURIComponent(p.title)}`} target="_blank" className="ml-auto inline-flex items-center gap-2 bg-[#16A34A] hover:bg-emerald-500 text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                        <IconWhatsApp className="w-4 h-4" />
                        Je suis intéressé
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION GALERIE ===== */}
      {galleryImages.length > 1 && (
        <section className="py-24 md:py-32 px-5 md:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-16 md:mb-20" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
              <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">Galerie</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mt-3 leading-tight">Nos réalisations</h2>
              <p className="text-[#64748B] mt-4 max-w-xl mx-auto text-base md:text-lg">Découvrez notre travail en images</p>
            </motion.div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
              {galleryImages.map((p, i) => (
                <motion.button
                  key={p.id} onClick={() => setLightbox(p.image || null)}
                  className="break-inside-avoid overflow-hidden rounded-2xl group relative cursor-pointer w-full"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} custom={i}
                >
                  <img src={p.image} alt={p.title} className={`w-full ${i % 3 === 0 ? "h-80 md:h-96" : i % 3 === 1 ? "h-64 md:h-72" : "h-72 md:h-80"} object-cover group-hover:scale-105 transition-all duration-700 ease-out`} loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <span className="text-white font-semibold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500">{p.title}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== SECTION AVIS ===== */}
      <ReviewsSection name={catalog.name} />

      {/* ===== SECTION À PROPOS ===== */}
      <section className="py-24 md:py-32 px-5 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp}>
            <div className="relative">
              <div className="rounded-[24px] overflow-hidden shadow-2xl">
                {firstImage ? (
                  <img src={firstImage} alt={catalog.name} className="w-full h-[350px] md:h-[450px] object-cover" />
                ) : (
                  <div className="w-full h-[350px] md:h-[450px] bg-gradient-to-br from-emerald-100 via-emerald-50 to-sky-100 flex items-center justify-center">
                    <span className="text-9xl font-extrabold text-emerald-200">{catalog.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-5 -right-5 w-auto h-auto bg-[#16A34A] rounded-2xl px-5 py-4 flex flex-col items-center justify-center text-white shadow-xl">
                <span className="text-2xl font-extrabold">{products.length}</span>
                <span className="text-xs font-medium opacity-90">Offres</span>
              </div>
            </div>
            <div>
              <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">À propos</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mt-3 leading-tight max-w-[800px]">{catalog.name}</h2>
              <div className="w-16 h-1 bg-[#16A34A] mt-6 rounded-full" />
              <p className="text-[#64748B] mt-6 leading-relaxed text-base md:text-lg max-w-[800px]">
                {catalog.description || "Professionnel dédié à la satisfaction de ses clients. Qualité, sérieux et confiance sont nos valeurs fondamentales. Nous mettons un point d'honneur à offrir un service irréprochable à chaque client."}
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { icon: "✓", text: "Professionnel certifié", desc: "Qualité et expertise garanties" },
                  { icon: "⚡", text: "Réponse rapide", desc: "Sous 24h maximum" },
                  { icon: "🛡️", text: "Satisfaction client", desc: "Notre priorité absolue" },
                ].map((item, i) => (
                  <motion.div key={item.text} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-[#0F172A] text-sm">{item.text}</p>
                      <p className="text-xs text-[#64748B]">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION CONTACT ===== */}
      <ContactSection catalog={catalog} waNum={waNum} />

      {/* ===== SECTION QR CODE (uniquement si showQRCode = true) ===== */}
      {showQRCode && <QRCodeSection catalog={catalog} />}

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-5 bg-slate-950 text-center">
        <p className="text-slate-500 text-xs">
          © {new Date().getFullYear()} {catalog.name} — Propulsé par <span className="text-emerald-400 font-semibold">VistaLink</span>
        </p>
      </footer>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-5 right-5 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all z-10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <motion.img src={lightbox} alt="" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}