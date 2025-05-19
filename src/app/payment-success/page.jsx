"use client";
import { Suspense } from "react";
import PaymentDetails from "@/components/PaymentDetails"

export const dynamic = "force-dynamic";

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <PaymentDetails />
    </Suspense>
  );
}