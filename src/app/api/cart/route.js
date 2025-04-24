import { NextResponse } from "next/server"
import getCookieInfo from "../../../../lib/getCookieInfo"
import fetchWooCommerce from "../../../../lib/fetchWooCommerce"

export async function GET() {
  try {
    const [token] = await getCookieInfo()
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch user details
    const userData = await fetchWooCommerce("wp/v2/users/me", "Failed to fetch user data", token)
    const userId = userData.id

    // Fetch pending orders
    const orders = await fetchWooCommerce(`wc/v3/orders?customer=${userId}&status=pending`, "Failed to fetch orders")
    const pendingOrder = orders.find(order => order.status === "pending")

    if (pendingOrder) {
      return NextResponse.json({ orderId: pendingOrder.id, items: pendingOrder.line_items })
    }

    return NextResponse.json({ orderId: null, items: [] })
  } catch (error) {
    console.error("Error fetching cart:", error.message)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function PUT() {
  try {
    const [token] = await getCookieInfo()
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch user details
    const userData = await fetchWooCommerce("wp/v2/users/me", "Failed to fetch user", token)
    const userId = userData.id;

    // Fetch pending orders
    const orders = await fetchWooCommerce(`wc/v3/orders?customer=${userId}&status=pending`, "Failed to fetch orders")
    const pendingOrder = orders.find(order => order.status === "pending");

    if (!pendingOrder) {
      return NextResponse.json({ error: "No pending order found" }, { status: 404 });
    }

    // Update the order to clear line items
    const clearCartError = "Failed to clear cart"
    const result = await fetchWooCommerce(`wc/v3/orders/${pendingOrder.id}`, clearCartError, null, "PUT", { line_items: [] })
    return NextResponse.json({ message: "Cart cleared", data: result });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    return NextResponse.json({ error: clearCartError }, { status: 500 });
  }
}
