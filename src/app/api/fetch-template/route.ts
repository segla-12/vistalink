import { NextRequest, NextResponse } from "next/server";

// ─── Proxy pour récupérer le HTML d'un template externe ─
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "URL parameter required" }, { status: 400 });
    }

    console.log(`[fetch-template] Fetching: ${url}`);

    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`[fetch-template] HTTP ${response.status} for ${url}`);
      return NextResponse.json(
        { error: `Le serveur a répondu avec le statut ${response.status} (${response.statusText})` },
        { status: 502 }
      );
    }

    const html = await response.text();

    if (!html || html.length < 100) {
      console.error(`[fetch-template] HTML trop court (${html?.length || 0} caractères) pour ${url}`);
      return NextResponse.json(
        { error: "Le template récupéré est vide ou invalide" },
        { status: 502 }
      );
    }

    console.log(`[fetch-template] Succès: ${html.length} caractères récupérés depuis ${url}`);

    return NextResponse.json({ html });
  } catch (err: any) {
    console.error(`[fetch-template] Erreur:`, err.message, err.cause || "");

    if (err.name === "TimeoutError" || err.code === "UND_ERR_CONNECT_TIMEOUT") {
      return NextResponse.json(
        { error: "Le template distant n'a pas répondu à temps (15 secondes)" },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: `Impossible de récupérer le template : ${err.message}` },
      { status: 502 }
    );
  }
}