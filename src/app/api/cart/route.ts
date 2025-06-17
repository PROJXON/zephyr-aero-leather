import { NextResponse } from "next/server";
import getCookieInfo from "../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";
import type { WordPressUser } from "../../../../types/types";
import type { WooOrder } from "../../../../types/woocommerce";

export async function GET(): Promise<Response> {
  try {
    const [token] = await getCookieInfo();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userData = await fetchWooCommerce<WordPressUser>("wp/v2/users/me", "Failed to fetch user data", token);
    const userId = userData.id;

    const orders = await fetchWooCommerce<WooOrder[]>(`wc/v3/orders?customer=${userId}&status=pending`, "Failed to fetch orders");
    const pendingOrder = orders.find((order) => order.status === "pending");

    if (pendingOrder) {
      return NextResponse.json({ orderId: pendingOrder.id, items: pendingOrder.line_items });
    }

    return NextResponse.json({ orderId: null, items: [] });
  } catch (error: unknown) {
    console.error("Error fetching cart:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function PUT(): Promise<Response> {
  const clearCartError = "Failed to clear cart";

  try {
    const [token] = await getCookieInfo();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userData = await fetchWooCommerce<WordPressUser>("wp/v2/users/me", "Failed to fetch user", token);
    const userId = userData.id;

    const orders = await fetchWooCommerce<WooOrder[]>(`wc/v3/orders?customer=${userId}&status=pending`, "Failed to fetch orders");
    const pendingOrder = orders.find((order) => order.status === "pending");

    if (!pendingOrder) {
      return NextResponse.json({ error: "No pending order found" }, { status: 404 });
    }

    const result = await fetchWooCommerce(`wc/v3/orders/${pendingOrder.id}`, clearCartError, null, "PUT", { line_items: [] });
    return NextResponse.json({ message: "Cart cleared", data: result });
  } catch (error: unknown) {
    console.error("Error clearing cart:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: clearCartError }, { status: 500 });
  }
}
