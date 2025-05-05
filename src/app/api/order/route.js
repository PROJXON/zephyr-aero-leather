import { NextResponse } from "next/server"
import getCookieInfo from "../../../../lib/getCookieInfo"
import fetchWooCommerce from "../../../../lib/fetchWooCommerce"

export async function GET() {
    const [token] = await getCookieInfo()
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const ordersError = "Error fetching orders"

    try {
        const orders = await fetchWooCommerce("customcarteditor/v1/get-orders", ordersError, token)
        return NextResponse.json({ orders })
    } catch {
        return NextResponse.json({ error: ordersError }, { status: 500 })
    }
}