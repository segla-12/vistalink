"use client";

import Sidebar from "./components/Sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/upload";

export default function EditPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const [catalog, setCatalog] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [token, setToken] = useState<string>("");

  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    media_type: "image",
  });

  // Récupérer token proprement
  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params;
      setToken(resolved.token);
    };

    resolveParams();
  }, [params]);

  // Charger catalogue
  useEffect(() => {
    if (!token) return;

    const load = async () => {
      const { data } = await supabase
        .from("catalogs")
        .select("*")
        .eq("edit_token", token)
        .single();

      setCatalog(data);

      if (data) {
        const res = await supabase
          .from("products")
          .select("*")
          .eq("catalog_id", data.id);

        setProducts(res.data || []);
      }
    };

    load();
  }, [token]);

  // Ajouter produit
  const addProduct = async () => {
    if (!catalog) return;

    const { data, error } = await supabase
      .from("products")
      .insert({
        catalog_id: catalog.id,
        title: newProduct.title,
        description: newProduct.description,
        price: newProduct.price,
        image: newProduct.image,
        media_type: newProduct.media_type,
      })
      .select();

    if (!error && data) {
      setProducts([...products, data[0]]);

      setNewProduct({
        title: "",
        description: "",
        price: "",
        image: "",
        media_type: "image",
      });
    }
  };

  // SUPPRIMER PRODUIT
  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts(products.filter((p) => p.id !== id));
  };

  // UPDATE PRODUIT
  const updateProduct = async (product: any) => {
    await supabase
      .from("products")
      .update({
        title: product.title,
        description: product.description,
        price: product.price,
      })
      .eq("id", product.id);

    setEditingId(null);
  };

  if (!catalog) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Chargement ou lien invalide...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENT */}
      <div className="flex-1 p-8">

        <h1 className="text-2xl font-bold">
          Administration - {catalog.name}
        </h1>

        {/* FORM */}
        <div className="mt-6 space-y-3 max-w-xl">

          <input
            placeholder="Nom produit"
            value={newProduct.title}
            onChange={(e) =>
              setNewProduct({ ...newProduct, title: e.target.value })
            }
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded"
          />

          <input
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded"
          />

          <input
            placeholder="Prix"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded"
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              setUploading(true);

              const url = await uploadImage(file);

              setNewProduct({
                ...newProduct,
                image: url,
                media_type: file.type.startsWith("video")
                  ? "video"
                  : "image",
              });

              setUploading(false);
            }}
            className="w-full p-3 bg-slate-900 border border-slate-800 rounded"
          />

          {uploading && (
            <p className="text-blue-400 text-sm">Upload en cours...</p>
          )}

          <button
            onClick={addProduct}
            className="w-full bg-blue-600 py-3 rounded font-semibold"
          >
            Ajouter produit
          </button>
        </div>

        {/* LIST */}
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="border border-slate-800 rounded p-4">

              {p.media_type === "video" ? (
                <video
                  src={p.image}
                  controls
                  className="h-32 w-full object-cover rounded mb-3"
                />
              ) : (
                p.image && (
                  <img
                    src={p.image}
                    className="h-32 w-full object-cover rounded mb-3"
                  />
                )
              )}

              {/* EDIT MODE */}
              {editingId === p.id ? (
                <>
                  <input
                    value={p.title}
                    onChange={(e) =>
                      setProducts(
                        products.map((x) =>
                          x.id === p.id
                            ? { ...x, title: e.target.value }
                            : x
                        )
                      )
                    }
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded"
                  />

                  <input
                    value={p.price}
                    onChange={(e) =>
                      setProducts(
                        products.map((x) =>
                          x.id === p.id
                            ? { ...x, price: e.target.value }
                            : x
                        )
                      )
                    }
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded mt-2"
                  />

                  <button
                    onClick={() => updateProduct(p)}
                    className="mt-3 w-full bg-green-600 py-2 rounded"
                  >
                    Sauvegarder
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-slate-400">{p.description}</p>
                  <p className="text-blue-400 font-bold mt-2">
                    {p.price}
                  </p>

                  <button
                    onClick={() => setEditingId(p.id)}
                    className="mt-3 w-full bg-slate-700 py-2 rounded"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="mt-2 w-full bg-red-600 py-2 rounded"
                  >
                    Supprimer
                  </button>
                </>
              )}

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}