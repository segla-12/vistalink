"use client";

import { useEffect, useState } from "react";
import { initBlockRegistry } from "@/lib/blocks/registry";
import type { Block } from "@/lib/blocks/types";
import PageRenderer from "@/components/renderer/PageRenderer";
import CatalogView from "@/components/catalog/CatalogView";

let registryReady = false;
function ensureRegistry() {
  if (!registryReady) {
    initBlockRegistry();
    registryReady = true;
  }
}

interface Product {
  id: string;
  title: string;
  description?: string;
  price?: string;
  image?: string;
  media_type?: string;
}

interface Catalog {
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
  blocks?: Block[];
}

export default function CatalogClient({
  catalog,
  products,
}: {
  catalog: Catalog;
  products: Product[];
}) {
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    ensureRegistry();
    setRendered(true);
  }, []);

  if (!rendered) return null;

  // Nouveau format : le catalogue a des blocs enregistrés
  if (catalog.blocks && Array.isArray(catalog.blocks) && catalog.blocks.length > 0) {
    return (
      <PageRenderer
        blocks={catalog.blocks}
        project={{
          name: catalog.name,
          meta: { slug: catalog.slug },
          whatsapp: catalog.whatsapp,
        }}
      />
    );
  }

  // Ancien format : fallback vers CatalogView
  return (
    <CatalogView
      catalog={catalog}
      products={products}
      showQRCode={true}
    />
  );
}