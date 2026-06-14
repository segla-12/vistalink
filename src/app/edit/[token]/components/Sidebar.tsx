export default function Sidebar({
  isPaid,
  editToken,
}: {
  isPaid: boolean;
  editToken: string;
}) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold">VistaLink</h2>

        <nav className="mt-10 space-y-4 text-slate-300">
          <button
            onClick={() => scrollTo("section-add")}
            className="hover:text-white cursor-pointer flex items-center gap-2 w-full text-left"
          >
            ➕ Ajouter un produit
          </button>
          <button
            onClick={() => scrollTo("section-products")}
            className="hover:text-white cursor-pointer flex items-center gap-2 w-full text-left"
          >
            📦 Mes produits
          </button>
          <button
            onClick={() => scrollTo("section-preview")}
            className="hover:text-white cursor-pointer flex items-center gap-2 w-full text-left"
          >
            👁️ Aperçu
          </button>
        </nav>
      </div>

      {/* Statut et publication */}
      <div className="border-t border-slate-700 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <span
            className={`w-2 h-2 rounded-full ${
              isPaid ? "bg-green-500" : "bg-yellow-500"
            }`}
          />
          <span className="text-sm text-slate-400">
            {isPaid ? "Publié" : "Brouillon"}
          </span>
        </div>

        {!isPaid && (
          <a
            href={`/pay/${editToken}`}
            className="block w-full bg-green-600 py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition"
          >
            ✨ Publier mon catalogue
          </a>
        )}

        {isPaid && (
          <a
            href={`/success?token=${editToken}`}
            className="block w-full bg-blue-600 py-3 rounded-lg font-semibold text-center hover:bg-blue-700 transition"
          >
            📱 Voir mes liens
          </a>
        )}
      </div>
    </div>
  );
}