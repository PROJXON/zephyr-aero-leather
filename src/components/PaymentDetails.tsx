"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderSummary from "./OrderSummary";
import calculateTotal from "../../lib/calculateTotal";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import type { Product, CartItem, PaymentDetailsData } from "../../types/types";

export default function PaymentDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [allowed, setAllowed] = useState<boolean>(false);

  const { clearCart, refreshCart } = useCart();
  const queryIntent = searchParams.get("payment_intent");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const run = async () => {
      const intentFromURL = queryIntent;
      const intentFromSession = sessionStorage.getItem("payment_intent");
      const intent = intentFromURL || intentFromSession;

      if (!intent) return router.replace("/");

      setPaymentIntentId(intent);
      setAllowed(true);

      // Clean up session markers
      setTimeout(() => {
        sessionStorage.removeItem("payment_success");
        sessionStorage.removeItem("payment_intent");
      }, 500);

      await clearCart();

      for (let i = 0; i < 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const res = await fetch("/api/cart");
        const data = await res.json();

        if (!data.items || data.items.length === 0) {
          break;
        }

        if (i === 9) console.warn("⚠️ Woo cart still not empty after polling");
      }

      await refreshCart();
    };

    run();
  }, [clearCart, queryIntent, refreshCart, router]);

  useEffect(() => {
    const getProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    };
    getProducts();
  }, []);

  useEffect(() => {
    if (paymentIntentId && products.length > 0) {
      const run = async () => {
        try {
          await fetch(`/api/payment-intent-status?payment_intent_id=${paymentIntentId}`);
          const res = await fetch(`/api/payment?payment_intent=${paymentIntentId}`);
          const data = await res.json();
          setPaymentDetails(data);
          setTotal(calculateTotal(data.items, products));
        } catch (err) {
          console.error("Error syncing payment intent and Woo order:", err);
        }
      };
      run();
    }
  }, [paymentIntentId, products]);

  return allowed ? (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
      <p className="mb-6">Thank you for your purchase!</p>
      {paymentDetails ? (
        <OrderSummary
          cartItems={paymentDetails.items}
          products={products}
          total={total}
        />
      ) : (
        <p>Loading your payment details...</p>
      )}
    </div>
  ) : null;
}
