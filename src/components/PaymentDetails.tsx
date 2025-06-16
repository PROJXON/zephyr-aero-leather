"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
  const cartClearedRef = useRef(false);

  const { clearCart } = useCart();
  const queryIntent = searchParams.get("payment_intent");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const run = async () => {
      const intentFromURL = queryIntent;
      const intentFromSession = sessionStorage.getItem("payment_intent");
      const intent = intentFromURL || intentFromSession;
      const paymentSuccess = sessionStorage.getItem("payment_success");

      if (!intent && !paymentSuccess) {
        return router.replace("/");
      }

      setPaymentIntentId(intent);
      setAllowed(true);

      if (!cartClearedRef.current) {
        cartClearedRef.current = true;
        await clearCart();
      }
    };

    run();
  }, [clearCart, queryIntent, router]);

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
          showReviewLinks={true}
        />
      ) : (
        <p>Loading your payment details...</p>
      )}
    </div>
  ) : null;
}
