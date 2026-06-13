"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function PaymentSuccess() {
  const params = useSearchParams();
  const router = useRouter();

  const ref = params.get("ref");

  useEffect(() => {
    const activate = async () => {
      if (!ref) return;

      await supabase
        .from("catalogs")
        .update({ is_paid: true })
        .eq("edit_token", ref);

      router.push(`/success?token=${ref}`);
    };

    activate();
  }, [ref]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Activation en cours...
    </div>
  );
}