import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const catalog_id = searchParams.get("catalog_id");

    if (!catalog_id) {
      return NextResponse.json({ error: "catalog_id required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("catalog_id", catalog_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { catalog_id, title, description, price, image, media_type } = body;

    if (!catalog_id || !title) {
      return NextResponse.json({ error: "catalog_id and title required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert({
        catalog_id,
        title,
        description: description || "",
        price: price || "",
        image: image || "",
        media_type: media_type || "image",
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, price } = body;

    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    const { error } = await supabaseAdmin
      .from("products")
      .update({
        title,
        description: description || "",
        price: price || "",
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}