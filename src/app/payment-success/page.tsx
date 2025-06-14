"use client";
import { Suspense } from "react";
import PaymentDetails from "@/components/PaymentDetails";
import type { JSX } from "react";

export const dynamic = "force-dynamic";

export default function PaymentSuccess(): JSX.Element {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <PaymentDetails />
    </Suspense>
  );
}