import fetchProducts from "../../../lib/woocommerce";
import Checkout from "@/components/Checkout";
import LoadingSpinner from "@/components/LoadingSpinner";
import type { Product } from "../../../types/types";
import type { JSX } from "react";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

function CheckoutLoading() {
    return (
        <div className="container mx-auto p-6 mt-6">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            <LoadingSpinner message="Loading checkout..." />
        </div>
    );
}

async function CheckoutContent(): Promise<JSX.Element> {
    const products: Product[] = await fetchProducts();

    return (
        <div className="container mx-auto p-6 mt-6">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            <Checkout products={products} />
        </div>
    );
}

export default function CheckoutPage(): JSX.Element {
    return (
        <Suspense fallback={<CheckoutLoading />}>
            <CheckoutContent />
        </Suspense>
    );
}