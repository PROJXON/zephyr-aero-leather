"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import OrderSummary from "./OrderSummary";
import calculateTotal from "../../lib/calculateTotal";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";

export default function PaymentDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentIntentId, setPaymentIntentId] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [allowed, setAllowed] = useState(false);

  const { clearCart, fetchUserCart } = useCart();
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

      // 🧹 Clear cart and sync UI
      await clearCart(); // Clears Woo or localStorage
      await fetchUserCart(); // Syncs latest state for signed-in users
    };

    run();
  }, []);

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
