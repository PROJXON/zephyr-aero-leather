"use client";
import { Suspense } from "react";
import PaymentDetails from "@/components/PaymentDetails";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { JSX } from "react";

export const dynamic = "force-dynamic";

export default function PaymentSuccess(): JSX.Element {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading..." />}>
      <PaymentDetails />
    </Suspense>
  );
}