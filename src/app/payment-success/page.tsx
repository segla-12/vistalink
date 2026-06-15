"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { markLocalProjectAsPaid } from "@/lib/local-db";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  const ref = params.get("ref");
  const slug = params.get("slug");

  useEffect(() => {
    const activate = async () => {
      if (!ref) return;

      console.log(`[payment-success] Activation du projet: ${ref}`);

      // 1. Marquer comme payé en local (toujours)
      markLocalProjectAsPaid(ref);

      // 2. Essayer Supabase
      try {
        await supabase
          .from("catalogs")
          .update({ is_paid: true })
          .eq("edit_token", ref);
      } catch (e) {
        console.warn("[payment-success] Supabase indisponible, projet activé localement");
      }

      // 3. Rediriger
      if (slug) {
        router.push(`/success?token=${ref}&slug=${slug}`);
      } else {
        router.push(`/success?token=${ref}`);
      }
    };

    activate();
  }, [ref, slug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Activation en cours...</p>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Redirection...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}