"use client";

import { motion } from "framer-motion";
import type { Block, BlockType } from "@/lib/blocks/types";
import { getBlockMeta } from "@/lib/blocks/registry";
import { useMemo } from "react";

// ─── Animations ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const, delay: i * 0.1 },
  }),
};

// ─── Renderers par type de bloc ─────────────────────────

function HeroBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  const hasImage = content.image;

  return (
    <header
      className="relative flex items-center justify-center text-white overflow-hidden"
      style={{
        minHeight: "90vh",
        background: hasImage
          ? `linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 100%), url('${content.image}') center/cover no-repeat`
          : styles.backgroundColor || "#0F172A",
        padding: styles.padding || "80px 24px",
      }}
    >
      {hasImage && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />}
      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl mx-auto w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as const }}
      >
        {content.subtitle && (
          <motion.span
            className="inline-block text-sm text-white/70 tracking-[0.2em] uppercase mb-4 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {content.subtitle}
          </motion.span>
        )}
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {content.title}
        </motion.h1>
        {content.description && (
          <motion.p
            className="mt-5 text-base md:text-lg text-white/80 max-w-[700px] mx-auto leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {content.description}
          </motion.p>
        )}
        {content.buttonText && (
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <motion.a
              href={content.buttonUrl || "#"}
              target={content.buttonUrl?.startsWith("http") ? "_blank" : undefined}
              className="inline-flex items-center gap-3 px-12 py-5 md:px-16 md:py-6 rounded-full text-lg md:text-xl font-bold shadow-2xl transition-all duration-300"
              style={{ backgroundColor: content.buttonColor || "#16A34A", color: "#ffffff" }}
              whileHover={{ scale: 1.05, boxShadow: `0 20px 60px -10px ${content.buttonColor || "#16A34A"}80` }}
              whileTap={{ scale: 0.97 }}
            >
              {content.buttonText}
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </header>
  );
}

function TextBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  return (
    <section
      className="py-16 md:py-24 px-5 md:px-8"
      style={{
        backgroundColor: styles.backgroundColor || "transparent",
        color: styles.textColor || "#0F172A",
      }}
    >
      <div
        className="mx-auto text-center"
        style={{ maxWidth: styles.maxWidth || "800px" }}
      >
        {content.subtitle && (
          <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">
            {content.subtitle}
          </span>
        )}
        {content.title && (
          <h2 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">
            {content.title}
          </h2>
        )}
        {content.description && (
          <p className="mt-6 text-base md:text-lg leading-relaxed" style={{ color: "#64748B" }}>
            {content.description}
          </p>
        )}
      </div>
    </section>
  );
}

function ProductsBlock({ block }: { block: Block }) {
  const { content } = block;
  const items = content.items || [];
  if (items.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-5 md:px-8" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-7xl mx-auto">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {content.subtitle && <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">{content.subtitle}</span>}
          {content.title && <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mt-3">{content.title}</h2>}
          {content.description && <p className="text-[#64748B] mt-4 max-w-xl mx-auto">{content.description}</p>}
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id || i}
              className="group bg-white rounded-[24px] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            >
              {item.image && (
                <div className="relative h-[280px] overflow-hidden">
                  <img src={item.image} alt={item.title || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="p-6 md:p-7">
                <h3 className="text-xl md:text-2xl font-bold text-[#0F172A]">{item.title}</h3>
                {item.description && <p className="text-[#64748B] mt-3 leading-relaxed">{item.description}</p>}
                {item.price && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <span className="text-2xl font-extrabold text-[#16A34A]">{item.price}</span>
                    {content.buttonText && (
                      <span className="ml-auto bg-[#16A34A] text-white px-6 py-3 rounded-full text-sm font-semibold">{content.buttonText}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsBlock({ block }: { block: Block }) {
  const { content } = block;
  const items = content.items || [];

  return (
    <section className="relative py-16 md:py-24 px-5 md:px-8 overflow-hidden" style={{ backgroundColor: "#F0FDF4" }}>
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {content.subtitle && <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">{content.subtitle}</span>}
          {content.title && <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">{content.title}</h2>}
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <motion.div
              key={item.id || i}
              className="bg-white rounded-2xl p-6 md:p-7 shadow-lg border border-emerald-100/50"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <svg key={s} className={`w-4 h-4 ${s < (item.rating || 5) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed text-[15px]">&ldquo;{item.description}&rdquo;</p>
              <div className="flex items-center gap-3 mt-5 pt-5 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
                  {(item.title || "C").charAt(0)}
                </div>
                <p className="font-semibold text-sm text-slate-900">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  const stats = content.stats || [];

  return (
    <section
      className="py-16 md:py-24 px-5 md:px-8"
      style={{
        backgroundColor: styles.backgroundColor || "#0F172A",
        color: styles.textColor || "#ffffff",
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        {content.title && <h2 className="text-3xl md:text-5xl font-extrabold mb-12">{content.title}</h2>}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-emerald-400">{stat.value}</div>
              <div className="mt-2 text-sm opacity-80">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ImageBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  if (!content.image) return null;
  return (
    <div
      className="flex justify-center"
      style={{
        padding: styles.padding || "24px",
      }}
    >
      <img
        src={content.image}
        alt={content.title || ""}
        className="max-w-full h-auto"
        style={{
          borderRadius: styles.borderRadius || "16px",
          maxWidth: content.fullWidth ? "100%" : "800px",
          width: content.fullWidth ? "100%" : "auto",
        }}
      />
    </div>
  );
}

function CTABlock({ block }: { block: Block }) {
  const { content, styles } = block;
  return (
    <section
      className="py-16 md:py-24 px-5 md:px-8 text-center"
      style={{
        backgroundColor: styles.backgroundColor || "#0F172A",
        color: styles.textColor || "#ffffff",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {content.title && <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">{content.title}</h2>}
        {content.description && <p className="mt-4 text-lg opacity-80">{content.description}</p>}
        {content.buttonText && (
          <motion.a
            href={content.buttonUrl || "#"}
            target={content.buttonUrl?.startsWith("http") ? "_blank" : undefined}
            className="inline-flex items-center gap-3 mt-8 px-10 py-4 md:px-14 md:py-5 rounded-full text-lg font-bold shadow-2xl transition-all duration-300"
            style={{ backgroundColor: content.buttonColor || "#16A34A", color: "#ffffff" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            {content.buttonText}
          </motion.a>
        )}
      </div>
    </section>
  );
}

function FAQBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  const faqItems = content.faqItems || [];
  return (
    <section
      className="py-16 md:py-24 px-5 md:px-8"
      style={{ backgroundColor: styles.backgroundColor || "transparent" }}
    >
      <div className="mx-auto" style={{ maxWidth: styles.maxWidth || "800px" }}>
        {content.title && <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12">{content.title}</h2>}
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details key={i} className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <summary className="px-6 py-5 font-semibold text-[#0F172A] cursor-pointer hover:bg-slate-50 transition-colors flex items-center justify-between list-none">
                {item.question}
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-5 text-[#64748B] leading-relaxed">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingBlock({ block }: { block: Block }) {
  const { content } = block;
  const plans = content.pricingPlans || [];
  return (
    <section className="py-16 md:py-24 px-5 md:px-8" style={{ backgroundColor: "#F8FAFC" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {content.title && <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">{content.title}</h2>}
          {content.description && <p className="text-[#64748B] mt-4">{content.description}</p>}
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`bg-white rounded-[24px] p-8 shadow-xl transition-all duration-500 ${plan.highlight ? "ring-2 ring-emerald-500 scale-105 md:scale-110 relative" : ""}`}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  Populaire
                </span>
              )}
              <h3 className="text-xl font-bold text-[#0F172A]">{plan.name}</h3>
              <p className="text-3xl font-extrabold text-[#16A34A] mt-4">{plan.price}</p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-[#64748B]">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={content.buttonUrl || "#"}
                className={`mt-8 block w-full text-center py-3 rounded-full font-semibold text-sm transition-all ${plan.highlight ? "bg-[#16A34A] text-white hover:bg-emerald-500" : "bg-slate-100 text-[#0F172A] hover:bg-slate-200"}`}
              >
                {plan.cta || "Choisir"}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  return (
    <section
      className="py-16 md:py-24 px-5 md:px-8"
      style={{
        backgroundColor: styles.backgroundColor || "#0F172A",
        color: styles.textColor || "#ffffff",
      }}
    >
      <div className="max-w-2xl mx-auto text-center">
        {content.title && <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">{content.title}</h2>}
        {content.description && <p className="mt-4 text-lg opacity-80">{content.description}</p>}
        {content.buttonText && (
          <motion.a
            href={content.buttonUrl || "#"}
            className="inline-flex items-center gap-3 mt-8 px-10 py-4 rounded-full text-lg font-bold shadow-2xl"
            style={{ backgroundColor: content.buttonColor || "#16A34A", color: "#ffffff" }}
            whileHover={{ scale: 1.05 }}
          >
            {content.buttonText}
          </motion.a>
        )}
      </div>
    </section>
  );
}

function FeaturesBlock({ block }: { block: Block }) {
  const { content } = block;
  const items = content.items || [];
  return (
    <section className="py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {content.title && <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">{content.title}</h2>}
          {content.description && <p className="text-[#64748B] mt-4">{content.description}</p>}
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.id || i}
              className="text-center p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl mb-4">
                {item.icon || "✦"}
              </div>
              <h3 className="text-lg font-bold text-[#0F172A]">{item.title}</h3>
              {item.description && <p className="text-[#64748B] mt-2 text-sm">{item.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamBlock({ block }: { block: Block }) {
  const { content } = block;
  const members = content.teamMembers || [];
  return (
    <section className="py-16 md:py-24 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          {content.title && <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">{content.title}</h2>}
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {members.map((member, i) => (
            <motion.div
              key={member.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center text-3xl font-bold text-emerald-600 mb-4 shadow-lg">
                {member.name.charAt(0)}
              </div>
              <h3 className="font-bold text-[#0F172A]">{member.name}</h3>
              {member.role && <p className="text-sm text-[#64748B]">{member.role}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LogosBlock({ block }: { block: Block }) {
  const { content } = block;
  const logos = content.logos || [];
  return (
    <section className="py-12 px-5 md:px-8">
      <div className="max-w-5xl mx-auto text-center">
        {content.title && <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-8">{content.title}</h3>}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50">
          {logos.map((logo, i) => (
            <div key={i} className="h-8 md:h-10 flex items-center">
              {logo.src ? (
                <img src={logo.src} alt={logo.alt} className="h-full object-contain" />
              ) : (
                <div className="bg-slate-200 rounded-lg px-6 h-10 flex items-center text-xs text-slate-400 font-semibold">
                  {logo.alt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialBlock({ block }: { block: Block }) {
  const { content } = block;
  const links = content.socialLinks || [];
  return (
    <section className="py-12 px-5 md:px-8">
      <div className="text-center">
        {content.title && <h3 className="text-lg font-bold text-[#0F172A] mb-6">{content.title}</h3>}
        <div className="flex justify-center gap-4">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url || "#"}
              target="_blank"
              className="w-12 h-12 rounded-full bg-slate-100 hover:bg-emerald-100 flex items-center justify-center text-slate-600 hover:text-emerald-600 transition-all duration-300 text-lg"
            >
              {link.platform === "whatsapp" ? "📱" : link.platform === "facebook" ? "📘" : link.platform === "instagram" ? "📷" : "🔗"}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  return (
    <section className="py-16 md:py-24 px-5 md:px-8" style={{ backgroundColor: styles.backgroundColor || "transparent" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {content.image && (
            <div className="rounded-[24px] overflow-hidden shadow-2xl">
              <img src={content.image} alt={content.title || ""} className="w-full h-[350px] md:h-[450px] object-cover" />
            </div>
          )}
          <div>
            {content.subtitle && <span className="text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase">{content.subtitle}</span>}
            {content.title && <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] mt-3">{content.title}</h2>}
            {content.description && <p className="text-[#64748B] mt-6 leading-relaxed text-base md:text-lg">{content.description}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterBlock({ block }: { block: Block }) {
  const { content, styles } = block;
  return (
    <footer
      className="py-10 px-5 text-center"
      style={{
        backgroundColor: styles.backgroundColor || "#0F172A",
        color: styles.textColor || "#94a3b8",
      }}
    >
      <p className="text-sm" style={{ color: styles.textColor || "#94a3b8" }}>
        {content.title || "© 2026 Mon Business"}
      </p>
    </footer>
  );
}

// ─── Dispatch principal ─────────────────────────────────
const renderers: Record<BlockType, React.FC<{ block: Block }>> = {
  hero: HeroBlock,
  text: TextBlock,
  products: ProductsBlock,
  services: ProductsBlock, // Réutilise le layout produits
  about: AboutBlock,
  testimonials: TestimonialsBlock,
  stats: StatsBlock,
  pricing: PricingBlock,
  contact: ContactBlock,
  cta: CTABlock,
  image: ImageBlock,
  faq: FAQBlock,
  features: FeaturesBlock,
  team: TeamBlock,
  logos: LogosBlock,
  social: SocialBlock,
  footer: FooterBlock,
  gallery: ProductsBlock, // Réutilise le layout grille
  video: TextBlock,
  form: ContactBlock,
  countdown: CTABlock,
  map: TextBlock,
  qrcode: TextBlock,
  divider: TextBlock,
  embed: TextBlock,
  header: TextBlock,
};

export default function BlockRenderer({ block }: { block: Block }) {
  const Renderer = renderers[block.type];

  if (!Renderer) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm border border-dashed border-slate-200 rounded-xl mx-4">
        Bloc inconnu : <strong>{block.type}</strong>
      </div>
    );
  }

  return <Renderer block={block} />;
}