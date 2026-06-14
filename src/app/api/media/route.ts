import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// ─── GET : Lister les médias uploadés ────────────────────
export async function GET(request: NextRequest) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get("bucket") || "products";

    const { data, error } = await supabase.storage
      .from(bucket)
      .list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Construire les URLs publiques
    const urls = (data || [])
      .filter((file) => file.name && !file.name.startsWith("."))
      .map((file) => {
        const { data: urlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(file.name);
        return {
          name: file.name,
          url: urlData.publicUrl,
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || "image",
          created_at: file.created_at,
        };
      });

    return NextResponse.json({ urls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}