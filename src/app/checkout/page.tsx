import fetchProducts from "../../../lib/woocommerce";
import Checkout from "@/components/Checkout";
import type { Product } from "../../../types/types";
import { JSX } from "react";

export const dynamic = "force-dynamic";

export default async function CheckoutPage(): Promise<JSX.Element> {
    const products: Product[] = await fetchProducts();

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Checkout Page</h1>
            <Checkout products={products} />
        </div>
    );
}