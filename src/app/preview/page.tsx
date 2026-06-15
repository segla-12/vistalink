"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { initBlockRegistry } from "@/lib/blocks/registry";
import PageRenderer from "@/components/renderer/PageRenderer";
import type { Block } from "@/lib/blocks/types";

let registryInitialized = false;

function PreviewContent() {
  const searchParams = useSearchParams();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!registryInitialized) {
      initBlockRegistry();
      registryInitialized = true;
    }

    // Chargement initial via sessionStorage
    try {
      const key = searchParams.get("key") || "preview_blocks";
      const stored = sessionStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBlocks(parsed);
      }
    } catch (e) {
      console.error("Preview load error:", e);
    }
    setReady(true);
  }, [searchParams]);

  // Écoute les mises à jour en temps réel via postMessage
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      // Vérifier l'origine pour la sécurité
      if (
        event.origin !== window.location.origin &&
        event.origin !== "http://localhost:3000"
      ) {
        return;
      }

      if (event.data?.type === "preview:update" && Array.isArray(event.data.blocks)) {
        setBlocks(event.data.blocks);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          color: "#94a3b8",
          fontSize: "14px",
          fontFamily: "sans-serif",
        }}
      >
        Chargement...
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          color: "#94a3b8",
          fontSize: "14px",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "40px",
        }}
      >
        <div>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📄</div>
          <p style={{ fontWeight: 500 }}>Cette page est vide</p>
          <p style={{ marginTop: "8px", fontSize: "13px" }}>
            Ajoutez des blocs depuis l'éditeur
          </p>
        </div>
      </div>
    );
  }

  return <PageRenderer blocks={blocks} />;
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            color: "#94a3b8",
            fontSize: "14px",
            fontFamily: "sans-serif",
          }}
        >
          Chargement...
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}