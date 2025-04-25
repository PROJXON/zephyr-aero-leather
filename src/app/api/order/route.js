import { NextResponse } from "next/server"
import getCookieInfo from "../../../../lib/getCookieInfo"
import fetchWooCommerce from "../../../../lib/fetchWooCommerce"

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const userID = searchParams.get("userID")

    const [token] = await getCookieInfo()
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const ordersError = "Error fetching orders"

    try {
        const orders = await fetchWooCommerce(`wc/v3/orders?customer=${userID}&status=completed`, ordersError, token)
        return NextResponse.json({ orders })
    } catch {
        return NextResponse.json({ error: ordersError }, { status: 500 })
    }
}