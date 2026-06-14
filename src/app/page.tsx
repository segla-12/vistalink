import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wide">
          VistaLink
        </h1>

        <nav className="flex gap-6 text-sm text-slate-300">
          <a href="#features" className="hover:text-white">Fonctionnalités</a>
          <a href="#demo" className="hover:text-white">Exemple</a>
          <a href="#pricing" className="hover:text-white">Prix</a>
        </nav>

        <Link
          href="/create"
          className="bg-blue-600 px-4 py-2 rounded-lg font-semibold"
        >
          Créer un catalogue
        </Link>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-28">
        <h2 className="text-5xl font-bold leading-tight">
          Transforme ton activité en <br />
          catalogue professionnel instantané
        </h2>

        <p className="text-slate-400 mt-6 max-w-2xl mx-auto text-lg">
          VistaLink permet aux commerçants, artisans et freelances de créer une vitrine digitale
          moderne en quelques minutes, sans site web ni compétences techniques.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/create"
            className="bg-blue-600 px-6 py-3 rounded-lg font-semibold"
          >
            Commencer gratuitement
          </Link>

          <a
            href="#demo"
            className="border border-slate-700 px-6 py-3 rounded-lg"
          >
            Voir un exemple
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-10 py-20 grid md:grid-cols-3 gap-6">

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-xl font-semibold">⚡ Rapide</h3>
          <p className="text-slate-400 mt-2">
            Ton catalogue est prêt en moins de 2 minutes.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-xl font-semibold">📱 Mobile First</h3>
          <p className="text-slate-400 mt-2">
            Optimisé pour WhatsApp, Instagram et Facebook.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
          <h3 className="text-xl font-semibold">💼 Professionnel</h3>
          <p className="text-slate-400 mt-2">
            Donne une image crédible à ton business.
          </p>
        </div>

      </section>

      {/* DEMO */}
      <section id="demo" className="px-10 py-20 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center">
          Un exemple de catalogue
        </h2>

        <div className="mt-10 bg-slate-900 border border-slate-800 rounded-xl p-10 text-center">
          <p className="text-slate-400">
            Ici on affichera un vrai catalogue exemple (produits + images + vidéos)
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-10 py-20 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center">
          Nos forfaits
        </h2>

        <div className="mt-10 max-w-sm mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold">Catalogue Digital</h3>
            <p className="text-4xl font-bold mt-4 text-blue-400">1 000 FCFA</p>
            <p className="text-slate-400 text-sm mt-1">par mois</p>
            <ul className="mt-6 space-y-3 text-left text-slate-300">
              <li>✅ Catalogue en ligne personnalisé</li>
              <li>✅ Partage sur WhatsApp / réseaux sociaux</li>
              <li>✅ Images et vidéos illimitées</li>
              <li>✅ QR Code de votre catalogue</li>
              <li>✅ Bouton commande WhatsApp direct</li>
              <li>✅ Lien public personnalisé</li>
            </ul>

            <Link
              href="/create"
              className="mt-8 inline-block w-full bg-green-600 py-3 rounded font-semibold hover:bg-green-700 transition"
            >
              Commencer maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-24 border-t border-slate-800">
        <h2 className="text-4xl font-bold">
          Commence maintenant
        </h2>

        <p className="text-slate-400 mt-3">
          Aucun compte requis. Juste ton catalogue.
        </p>

        <Link
          href="/create"
          className="inline-block mt-8 bg-green-600 px-8 py-4 rounded-xl font-semibold"
        >
          Créer mon catalogue
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="text-center text-slate-500 py-10 border-t border-slate-800 text-sm">
        © {new Date().getFullYear()} VistaLink — Tous droits réservés
      </footer>

    </main>
  );
}