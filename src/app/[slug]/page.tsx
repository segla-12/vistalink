import { supabase } from "@/lib/supabase";
import CatalogClient from "./CatalogClient";

export default async function CatalogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { data: catalog } = await supabase
    .from("catalogs")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold">Catalogue introuvable</h1>
          <p className="text-slate-500 mt-2">Ce lien n'existe pas ou a été supprimé.</p>
        </div>
      </div>
    );
  }

  if (!catalog.is_paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 text-center p-6">
        <div className="max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold">Catalogue verrouillé</h1>
          <p className="text-slate-500 mt-2">
            Accès réservé après paiement
          </p>
          <a
            href={`/pay/${catalog.edit_token}`}
            className="mt-6 inline-block bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition shadow-lg"
          >
            Débloquer maintenant
          </a>
        </div>
      </div>
    );
  }

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("catalog_id", catalog.id);

  return <CatalogClient catalog={catalog} products={products || []} />;
}