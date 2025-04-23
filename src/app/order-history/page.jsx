import OrderHistory from "@/components/OrderHistory"
import getCookieInfo from "../../../lib/getCookieInfo"

export default async function OrderHistoryPage() {
    const [token] = await getCookieInfo()
    const woocommerceURL = process.env.WOOCOMMERCE_API_URL

    return (<div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Order History</h1>
        <OrderHistory token={token} wcURL={woocommerceURL} />
    </div>)
}