import OrderHistory from "@/components/OrderHistory";
import fetchProducts from "../../../lib/woocommerce";
import type { JSX } from "react";

export const revalidate = 60;

export default async function OrderHistoryPage(): Promise<JSX.Element> {
    const products = await fetchProducts();

    return (
        <div className="container mx-auto p-6 mt-8">
            <h1 className="text-3xl font-bold mb-4">Order History</h1>
            <OrderHistory products={products} />
        </div>
    );
}