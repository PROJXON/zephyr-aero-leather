import fetchProducts from "../../../lib/woocommerce"
import Checkout from "@/components/Checkout"

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
    const products = await fetchProducts()

    return (<div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Checkout Page</h1>
        <Checkout products={products} />
    </div>)
}