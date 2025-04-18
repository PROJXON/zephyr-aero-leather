"use client";
import CheckoutCart from "@/components/CheckoutCart";

export default function CheckoutPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutCart />
    </div>
  );
}
