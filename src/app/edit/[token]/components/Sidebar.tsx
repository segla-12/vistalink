export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-slate-900 border-r border-slate-800 p-6">
      <h2 className="text-xl font-bold">VistaLink</h2>

      <nav className="mt-10 space-y-4 text-slate-300">
        <p className="hover:text-white cursor-pointer">Produits</p>
        <p className="hover:text-white cursor-pointer">Ajouter</p>
        <p className="hover:text-white cursor-pointer">Statistiques</p>
        <p className="hover:text-white cursor-pointer">Paramètres</p>
      </nav>
    </div>
  );
}