"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

function PaymentSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();

  const ref = params.get("ref");
  const slug = params.get("slug");

  useEffect(() => {
    const activate = async () => {
      if (!ref) return;

      await supabase
        .from("catalogs")
        .update({ is_paid: true })
        .eq("edit_token", ref);

      if (slug) {
        router.push(`/success?token=${ref}&slug=${slug}`);
      } else {
        router.push(`/success?token=${ref}`);
      }
    };

    activate();
  }, [ref, slug]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Activation en cours...
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