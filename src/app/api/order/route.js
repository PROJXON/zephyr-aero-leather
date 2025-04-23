import { NextResponse } from "next/server"
import getCookieInfo from "../../../../lib/getCookieInfo"

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url)
        const userID = searchParams.get("userID")

        const [token] = await getCookieInfo()
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

        // console.log("userID", userID)
        // console.log("token", token)

        const ordersResponse = await fetch(
            `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/orders?customer=${userID}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
        const orders = await ordersResponse.json()
        //console.log("orders", orders)

        return NextResponse.json({ orders })
    } catch (error) {
        console.error("Error fetching orders:", error.message)
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}