"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import OrderSummary from "./OrderSummary";
import LoadingSpinner from "./LoadingSpinner";
import calculateTotal from "../../lib/calculateTotal";
import { useCart } from "@/app/context/CartContext";
import type { Product, PaymentDetailsData } from "../../types/types";
import type { WooCommerceAddress, WooOrder } from "../../types/woocommerce";

export default function PaymentDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetailsData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number | undefined>(undefined);
  const [shipping, setShipping] = useState<number | undefined>(undefined);
  const [tax, setTax] = useState<number | undefined>(undefined);
  const [allowed, setAllowed] = useState<boolean>(false);
  const cartClearedRef = useRef(false);
  const [shippingDetails, setShippingDetails] = useState<WooCommerceAddress | undefined>(undefined);

  const { clearCart } = useCart();
  const queryIntent = searchParams.get("payment_intent");

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
          
          // Get the actual order amounts from WooCommerce
          if (data.wooOrderId) {
            try {
              const orderRes = await fetch("/api/order");
              const orderData = await orderRes.json();
              const orders = orderData.orders || [];
              const order = orders.find((o: WooOrder) => o.id.toString() === data.wooOrderId);
              if (order) {
                setShippingDetails(order.shipping);
                // --- Extract correct values from WooCommerce order ---
                // Subtotal: sum of line_items[].subtotal
                const subtotal = order.line_items?.reduce((sum: number, item: any) => sum + parseFloat(item.subtotal || '0'), 0) || 0;
                // Shipping: sum of shipping_lines[].total
                const shipping = order.shipping_lines?.reduce((sum: number, line: any) => sum + parseFloat(line.total || '0'), 0) || 0;
                // Tax: use total_tax
                const tax = order.total_tax ? parseFloat(order.total_tax) : 0;
                // Total: use order.total
                const total = order.total ? parseFloat(order.total) : 0;
                setSubtotal(Math.round(subtotal * 100));
                setShipping(Math.round(shipping * 100));
                setTax(Math.round(tax * 100));
                setTotal(Math.round(total * 100));
              } else {
                // Fallback to calculated amounts if order not found
                const calculatedTotal = calculateTotal(data.items, products);
                setTotal(calculatedTotal);
              }
            } catch (err) {
              console.error("Error fetching order for amounts:", err);
              // Fallback to calculated amounts
              const calculatedTotal = calculateTotal(data.items, products);
              setTotal(calculatedTotal);
            }
          } else {
            // Fallback to calculated amounts if no order ID
            const calculatedTotal = calculateTotal(data.items, products);
            setTotal(calculatedTotal);
          }
        } catch (err) {
          console.error("Error syncing payment intent and Woo order:", err);
        }
      };
      run();
    }
  }, [paymentIntentId, products]);

  return allowed ? (
    <div className="container mx-auto p-6 mt-6">
      <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
      <p className="mb-6">Thank you for your purchase!</p>
      {paymentDetails ? (
        <OrderSummary
          cartItems={paymentDetails.items}
          products={products}
          total={total}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          showReviewLinks={true}
          shippingDetails={shippingDetails}
        />
      ) : (
        <LoadingSpinner message="Loading your payment details..." />
      )}
    </div>
  ) : null;
}
