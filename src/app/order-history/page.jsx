import OrderHistory from "@/components/OrderHistory"
import fetchProducts from "../../../lib/woocommerce"

export const dynamic = 'force-dynamic'

export default async function OrderHistoryPage() {
    const products = await fetchProducts()

    return (<div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Order History</h1>
        <OrderHistory products={products} />
    </div>)
}