import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Catalogue introuvable
      </div>
    );
  }

  // 🔒 BLOQUAGE PAIEMENT ICI (IMPORTANT)
  if (!catalog.is_paid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white text-center p-6">
        <div>
          <h1 className="text-2xl font-bold">
            🔒 Catalogue verrouillé
          </h1>

          <p className="text-slate-400 mt-2">
            Accès réservé après paiement (1000 FCFA / mois)
          </p>

          <a
            href={`/pay/${catalog.edit_token}`}
            className="mt-4 inline-block bg-green-600 px-6 py-3 rounded"
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

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO */}
      <header className="text-center py-16 border-b border-slate-800">
        <h1 className="text-4xl font-bold">{catalog.name}</h1>
        <p className="text-slate-400 mt-3 max-w-xl mx-auto">
          {catalog.description}
        </p>

        {catalog.whatsapp && (
          <a
            href={`https://wa.me/${catalog.whatsapp}`}
            className="inline-block mt-6 bg-green-600 px-6 py-3 rounded-full font-semibold"
          >
            Contacter sur WhatsApp
          </a>
        )}
      </header>

      {/* PRODUCTS */}
      <section className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {products?.map((p: any) => (
          <div
            key={p.id}
            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:scale-[1.02] transition duration-300"
          >

            {p.media_type === "video" ? (
              <video
                src={p.image}
                controls
                className="h-56 w-full object-cover"
              />
            ) : (
              <img
                src={p.image}
                className="h-56 w-full object-cover"
              />
            )}

            <div className="p-4">
              <h2 className="text-lg font-semibold">{p.title}</h2>

              <p className="text-slate-400 text-sm mt-1">
                {p.description}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-blue-400 font-bold">
                  {p.price}
                </span>

                <a
                  href={`https://wa.me/${catalog.whatsapp}?text=Je veux commander ${p.title}`}
                  className="bg-green-600 px-3 py-2 rounded text-sm"
                >
                  Commander
                </a>
              </div>
            </div>

          </div>
        ))}

      </section>

      {/* FLOATING CTA */}
      <a
        href={`https://wa.me/${catalog.whatsapp}`}
        className="fixed bottom-5 right-5 bg-green-500 px-5 py-3 rounded-full shadow-lg font-semibold"
      >
        WhatsApp
      </a>

    </main>
  );
}