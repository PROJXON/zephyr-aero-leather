import fetchProducts from "../../../lib/woocommerce";
import Checkout from "@/components/Checkout";
import type { Product } from "../../../types/types";
import { JSX, Suspense } from "react";

export const dynamic = "force-dynamic";

function CheckoutLoading() {
    return (
        <div className="container mx-auto p-6 mt-6">
            <h1 className="text-3xl font-bold mb-4">Checkout</h1>
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-dark mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </div>
            </div>
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