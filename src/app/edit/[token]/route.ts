import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { edit_token } = await request.json();

    if (!edit_token) {
      return NextResponse.json({ error: "edit_token required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    // Fetch project details
    const { data: project, error: fetchError } = await supabaseAdmin
      .from("catalogs")
      .select("id, name, slug, is_paid")
      .eq("edit_token", edit_token)
      .single();

    if (fetchError || !project) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    if (!project.is_paid) {
      return NextResponse.json({ error: "Le projet n'est pas payé. Impossible de publier." }, { status: 403 });
    }

    // Generate public URL, edit URL, QR code
    const publicUrl = `${request.nextUrl.origin}/p/${project.slug}`;
    const editUrl = `${request.nextUrl.origin}/edit/${project.edit_token}`;
    const qrCodeDataUrl = await QRCode.toDataURL(publicUrl);

    return NextResponse.json({
      message: "Projet publié avec succès",
      publicUrl,
      editUrl,
      qrCodeUrl: qrCodeDataUrl,
    });
  } catch (err: any) {
    console.error("[API /api/project/publish] Error:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}