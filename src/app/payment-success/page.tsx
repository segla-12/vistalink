"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function MockPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order_id");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");
  const description = searchParams.get("description");
  const editToken = searchParams.get("edit_token");
  const slug = searchParams.get("slug");

  useEffect(() => {
    if (editToken) {
      // Simulate payment processing
      const timer = setTimeout(() => {
        // Redirect to payment success page
        router.push(`/payment-success?ref=${editToken}&slug=${slug || ''}`);
      }, 2000); // Simulate 2 seconds payment processing

      return () => clearTimeout(timer);
    } else {
      router.push("/dashboard?error=Payment details missing");
    }
  }, [editToken, slug, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Simulateur de Paiement</h1>
        <p className="text-gray-700 mb-2">
          Commande: <span className="font-semibold">{orderId}</span>
        </p>
        <p className="text-gray-700 mb-2">
          Montant: <span className="font-semibold">{amount} {currency}</span>
        </p>
        <p className="text-gray-700 mb-4">
          Description: <span className="font-semibold">{description}</span>
        </p>
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Traitement de votre paiement...</p>
      </div>
    </div>
  );
}