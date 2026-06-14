import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── GET : Charger un projet par edit_token ─────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "token required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    // Charger le catalogue
    const { data: catalog, error } = await supabaseAdmin
      .from("catalogs")
      .select("*")
      .eq("edit_token", token)
      .single();

    if (error || !catalog) {
      return NextResponse.json({ error: "Catalogue introuvable" }, { status: 404 });
    }

    // Si le catalogue a déjà des blocs, on les retourne (nouveau format)
    if (catalog.blocks && Array.isArray(catalog.blocks) && catalog.blocks.length > 0) {
      return NextResponse.json({
        project: {
          id: catalog.id,
          name: catalog.name,
          type: catalog.type || "catalogue",
          language: catalog.language || "fr",
          blocks: catalog.blocks,
          globalStyles: catalog.global_styles || {
            fontFamily: "Inter",
            primaryColor: "#16A34A",
            secondaryColor: "#64748B",
            accentColor: "#0EA5E9",
            backgroundColor: "#ffffff",
            textColor: "#0F172A",
          },
          meta: {
            title: catalog.name,
            description: catalog.description || "",
            slug: catalog.slug,
          },
          whatsapp: catalog.whatsapp,
          phone: catalog.phone || "",
          email: catalog.email || "",
          address: catalog.address || "",
          hours: catalog.hours || "",
          is_paid: catalog.is_paid,
          edit_token: catalog.edit_token,
        },
      });
    }

    // Sinon, migration automatique depuis l'ancien format (table products)
    const { data: products } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("catalog_id", catalog.id);

    // Construire les blocs à partir des produits
    const blocks: any[] = [];

    // Bloc Hero
    blocks.push({
      id: "hero-1",
      type: "hero",
      content: {
        title: catalog.name,
        subtitle: catalog.category || "",
        description: catalog.description || "",
        buttonText: catalog.whatsapp ? "Contacter sur WhatsApp" : "Demander un devis",
        buttonUrl: catalog.whatsapp ? `https://wa.me/${catalog.whatsapp.replace(/[^0-9]/g, "")}` : "#",
        buttonColor: "#16A34A",
        layout: "center",
        image: products?.[0]?.image || "",
        overlay: true,
        fullWidth: true,
      },
      styles: { padding: "80px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" },
      order: 0,
      visible: true,
    });

    // Bloc Produits/Services
    if (products && products.length > 0) {
      blocks.push({
        id: "products-1",
        type: "products",
        content: {
          title: "Nos offres",
          subtitle: "Découvrez nos prestations",
          description: "Des services conçus pour répondre à vos besoins",
          buttonText: "Je suis intéressé",
          items: products.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || "",
            price: p.price || "",
            image: p.image || "",
          })),
          columns: 3,
        },
        styles: { padding: "64px 24px", backgroundColor: "#F8FAFC" },
        order: 1,
        visible: true,
      });
    }

    // Bloc Contact
    blocks.push({
      id: "contact-1",
      type: "contact",
      content: {
        title: "Parlons de votre projet",
        description: "Une question ? Une commande ? N'hésitez pas à nous contacter.",
        buttonText: "Contacter sur WhatsApp",
        buttonUrl: catalog.whatsapp ? `https://wa.me/${catalog.whatsapp.replace(/[^0-9]/g, "")}` : "#",
        buttonColor: "#16A34A",
        layout: "center",
      },
      styles: { padding: "64px 24px", backgroundColor: "#0F172A", textColor: "#ffffff" },
      order: 2,
      visible: true,
    });

    // Bloc Footer
    blocks.push({
      id: "footer-1",
      type: "footer",
      content: {
        title: `© ${new Date().getFullYear()} ${catalog.name} — Propulsé par VistaLink`,
      },
      styles: { padding: "32px 24px", backgroundColor: "#0F172A", textColor: "#94a3b8" },
      order: 3,
      visible: true,
    });

    // Sauvegarder les blocs générés dans le catalogue
    await supabaseAdmin
      .from("catalogs")
      .update({
        blocks: blocks,
        type: catalog.type || "catalogue",
        language: catalog.language || "fr",
        global_styles: catalog.global_styles || {
          fontFamily: "Inter",
          primaryColor: "#16A34A",
          secondaryColor: "#64748B",
          accentColor: "#0EA5E9",
          backgroundColor: "#ffffff",
          textColor: "#0F172A",
        },
      })
      .eq("id", catalog.id);

    return NextResponse.json({
      project: {
        id: catalog.id,
        name: catalog.name,
        type: catalog.type || "catalogue",
        language: catalog.language || "fr",
        blocks,
        globalStyles: {
          fontFamily: "Inter",
          primaryColor: "#16A34A",
          secondaryColor: "#64748B",
          accentColor: "#0EA5E9",
          backgroundColor: "#ffffff",
          textColor: "#0F172A",
        },
        meta: {
          title: catalog.name,
          description: catalog.description || "",
          slug: catalog.slug,
        },
        whatsapp: catalog.whatsapp,
        phone: catalog.phone || "",
        email: catalog.email || "",
        address: catalog.address || "",
        hours: catalog.hours || "",
        is_paid: catalog.is_paid,
        edit_token: catalog.edit_token,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── PUT : Sauvegarder un projet (blocs + métadonnées) ──
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { edit_token, name, blocks, type, language, globalStyles, meta, whatsapp, phone, email, address, hours } = body;

    if (!edit_token) {
      return NextResponse.json({ error: "edit_token required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    const updates: any = {};
    if (name) updates.name = name;
    if (blocks) updates.blocks = blocks;
    if (type) updates.type = type;
    if (language) updates.language = language;
    if (globalStyles) updates.global_styles = globalStyles;
    if (whatsapp !== undefined) updates.whatsapp = whatsapp;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (address !== undefined) updates.address = address;
    if (hours !== undefined) updates.hours = hours;
    if (meta?.slug) updates.slug = meta.slug;
    if (meta?.description) updates.description = meta.description;

    const { error } = await supabaseAdmin
      .from("catalogs")
      .update(updates)
      .eq("edit_token", edit_token);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}