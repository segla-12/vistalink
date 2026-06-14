import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Types de fichiers supportés
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm", "video/avi"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── Compression d'image côté serveur ────────────────────
async function compressImage(buffer: Uint8Array, contentType: string): Promise<{ buffer: Uint8Array; contentType: string }> {
  // On utilise sharp si disponible, sinon on retourne tel quel
  try {
    const sharp = (await import("sharp")).default;
    const compressed = await sharp(Buffer.from(buffer))
      .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    
    return {
      buffer: new Uint8Array(compressed.buffer),
      contentType: "image/webp",
    };
  } catch {
    // Sharp n'est pas installé, on retourne le buffer original
    return { buffer, contentType };
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: `Format non supporté: ${file.type}. Utilisez JPG, PNG, WebP, GIF, MP4, MOV ou WebM.` },
        { status: 400 }
      );
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: "Image trop volumineuse (max 10MB)" }, { status: 400 });
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json({ error: "Vidéo trop volumineuse (max 100MB)" }, { status: 400 });
    }

    let arrayBuffer = await file.arrayBuffer();
    let buffer: any = new Uint8Array(arrayBuffer);
    let finalType = file.type;
    let finalExt = file.name.split(".").pop() || "bin";

    // Compression des images
    if (isImage) {
      try {
        const result = await compressImage(buffer, file.type);
        buffer = new Uint8Array(result.buffer);
        finalType = result.contentType;
        finalExt = "webp";
      } catch {
        // Si la compression échoue, on garde l'original
      }
    }

    const timestamp = Date.now();
    const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "_");
    const fileName = `${timestamp}-${baseName}.${finalExt}`;

    const supabaseAdmin = getAdminClient();

    // Upload dans le bucket "products" (ou "media" si disponible)
    const bucket = isImage ? "products" : "products";
    
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: finalType,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: data.publicUrl,
      type: isImage ? "image" : "video",
      originalName: file.name,
      size: buffer.length,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}