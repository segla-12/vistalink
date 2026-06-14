# Vistalink PRO — Architecture

## 1. Structure des Pages

```
/                           → Landing page marketing
/create                     → Création de projet (type + langue)
/create/[type]              → Assistant de création par type
/edit/[token]               → Éditeur drag & drop
/p/[slug]                   → Page publique (render unique)
/pay/[token]                → Paiement publication
/success                    → Liens + QR Code après pub
```

## 2. Système de Layout

Chaque page publique utilise le **même moteur de rendu** (`PageRenderer`) :

```
PageRenderer ← Bloc[] ← BlockRenderer ← SectionRenderer
```

Les blocs sont stockés en JSON dans Supabase.

L'éditeur manipule ce JSON.

Le renderer public affiche ce JSON.

Aucune différence entre aperçu et public.

## 3. Types de Projets

```
landing-page | catalogue | mini-site | portfolio | funnel |
reservation | sales-page
```

## 4. Blocs

Chaque bloc = un composant React autonome avec :

```typescript
interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  styles: Record<string, any>;
  order: number;
}
```

Bibliothèque : Hero, Gallery, Products, Services, Testimonials, FAQ,
Stats, Pricing, Contact, Map, Social, QRCode, Video, Form,
Countdown, CTA, Header, Footer, About, Features, Team, Logos

## 5. i18n

Fichiers dans `/locales/{lang}/common.json`

Langues supportées : fr, en, es, pt, ar, de, it

## 6. Templates

Stockés dans `/src/templates/{type}/{category}.ts`

Chaque template = une configuration de blocs préremplie.

## 7. Design System

- Police : Inter
- Couleurs : #0F172A, #64748B, #16A34A, #0EA5E9, #F8FAFC
- Coins : rounded-2xl / rounded-3xl
- Ombres : shadow-xl / shadow-2xl
- Animations : Framer Motion (fadeUp, scaleIn, slideLeft, slideRight)
- Responsive : mobile-first

## 8. Performance

- Next.js App Router
- Static Generation pour pages publiques
- ISR pour mises à jour
- Images optimisées (next/image)
- Code splitting par bloc
- Lazy loading

## 9. Monetisation

- Création = gratuite
- Édition = gratuite
- Aperçu = gratuit
- Publication = payant (unique ou abonnement)
- Revendeur = l'utilisateur fixe son prix, Vistalink prend une commission sur la publication