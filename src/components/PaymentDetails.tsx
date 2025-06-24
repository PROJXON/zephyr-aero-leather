"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import OrderSummary from "./OrderSummary";
import LoadingSpinner from "./LoadingSpinner";
import calculateTotal from "../../lib/calculateTotal";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import type { Product, PaymentDetailsData, OrderTotals } from "../../types/types";
import type { WooCommerceAddress, WooOrder, WooOrderLineItem, WooOrderShippingLine } from "../../types/woocommerce";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const cartClearedRef = useRef(false);
  const [shippingDetails, setShippingDetails] = useState<WooCommerceAddress | undefined>(undefined);

  const { clearCart } = useCart();
  const { user } = useAuth();
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
    const loadAllData = async () => {
      if (!paymentIntentId) return;
      
      try {
        // First get payment details to get the wooOrderId
        const paymentRes = await fetch(`/api/payment?payment_intent=${paymentIntentId}`);
        const paymentData = await paymentRes.json();
        
        // Load products and order data in parallel
        const [productsRes, orderRes] = await Promise.all([
          fetch("/api/products"),
          // Use appropriate endpoint based on authentication status
          user ? fetch("/api/order", { credentials: 'include' }) // Signed-in user: get all orders
            : fetch(`/api/order?id=${paymentData.wooOrderId}&payment_intent=${paymentIntentId}`) // Guest: lookup specific order
        ]);

        const [productsData, orderData] = await Promise.all([
          productsRes.json(),
          orderRes.json()
        ]);

        const orders = orderData.orders || [];
        
        // Find the specific order for this payment
        let order = orders.find((o: WooOrder) => o.id.toString() === paymentData.wooOrderId);
        
        // If no order found, try to find by payment intent ID as fallback
        if (!order) {
          order = orders.find((o: WooOrder) => 
            o.meta_data?.some((meta) => 
              meta.key === "stripe_payment_intent_id" && meta.value === paymentIntentId
            )
          );
        } // If no order found and this is a guest user, the webhook might not have finished yet
        // Try to retry after a short delay
        if (!order && !user && !paymentData.wooOrderId) {
          setTimeout(() => {
            loadAllData();
          }, 2000);
          return;
        }

        // Prepare all the data
        const orderTotals: OrderTotals = {
          subtotal: undefined,
          shipping: undefined,
          tax: undefined,
          total: 0,
          shippingDetails: undefined
        };

        if (order) {
          orderTotals.shippingDetails = order.shipping;
          const subtotal = order.line_items?.reduce((sum: number, item: WooOrderLineItem) => sum + parseFloat(item.subtotal || '0'), 0) || 0;
          const shipping = order.shipping_lines?.reduce((sum: number, line: WooOrderShippingLine) => sum + parseFloat(line.total || '0'), 0) || 0;
          const tax = order.total_tax ? parseFloat(order.total_tax) : 0;
          const total = order.total ? parseFloat(order.total) : 0;
          
          orderTotals.subtotal = Math.round(subtotal * 100);
          orderTotals.shipping = Math.round(shipping * 100);
          orderTotals.tax = Math.round(tax * 100);
          orderTotals.total = Math.round(total * 100);
        } else {
          // Fallback to calculated amounts if order not found
          const calculatedTotal = calculateTotal(paymentData.items, productsData);
          orderTotals.total = calculatedTotal;
        }

        // Set all state together so everything appears at once
        setProducts(productsData);
        setPaymentDetails(paymentData);
        setSubtotal(orderTotals.subtotal);
        setShipping(orderTotals.shipping);
        setTax(orderTotals.tax);
        setTotal(orderTotals.total);
        setShippingDetails(orderTotals.shippingDetails);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading payment details:", error);
        setIsLoading(false);
        // Handle error silently or show user-friendly message
        // Could add error state here if needed
      }
    };

    loadAllData();
  }, [paymentIntentId, user]);

  return allowed ? (
    <div className="container mx-auto p-6 mt-6 pb-16">
      <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
      <p className="mb-6">Thank you for your purchase!</p>
      {isLoading || !paymentDetails || products.length === 0 || subtotal === undefined || shipping === undefined || tax === undefined ? (
        <LoadingSpinner message="Loading your payment details..." />
      ) : (
        <OrderSummary
          cartItems={paymentDetails.items}
          products={products}
          total={total}
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          showReviewLinks={true}
          shippingDetails={shippingDetails}
          isLoading={false}
        />
      )}
    </div>
  ) : null;
}
