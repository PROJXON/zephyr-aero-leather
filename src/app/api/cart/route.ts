import { NextResponse } from "next/server";
import getCookieInfo from "../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";
import type { WooOrder } from "../../../../types/woocommerce";

export async function GET(): Promise<Response> {
  try {
    const [token] = await getCookieInfo();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userData = await fetchWooCommerce("wp/v2/users/me", "Failed to fetch user data", token);
    if (typeof userData !== "object" || userData === null || !("id" in userData)) {
      throw new Error("Invalid user data received from WooCommerce");
    }
    const userId = (userData as { id: number }).id;

    const orders = await fetchWooCommerce(`wc/v3/orders?customer=${userId}&status=pending`, "Failed to fetch orders");
    if (!Array.isArray(orders)) {
      throw new Error("Invalid orders data received from WooCommerce");
    }
    const pendingOrder = orders.find((order: WooOrder) => order.status === "pending");

    if (pendingOrder) {
      return NextResponse.json({ orderId: pendingOrder.id, items: pendingOrder.line_items });
    }

    return NextResponse.json({ orderId: null, items: [] });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      const err = error as { message: string };
      console.error("Error fetching cart:", err.message);
    } else {
      console.error("Error fetching cart:", error);
    }
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }
}

export async function PUT(): Promise<Response> {
  const clearCartError = "Failed to clear cart";

  try {
    const [token] = await getCookieInfo();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userData = await fetchWooCommerce("wp/v2/users/me", "Failed to fetch user", token);
    if (typeof userData !== "object" || userData === null || !("id" in userData)) {
      throw new Error("Invalid user data received from WooCommerce");
    }
    const userId = (userData as { id: number }).id;

    const orders = await fetchWooCommerce(`wc/v3/orders?customer=${userId}&status=pending`, "Failed to fetch orders");
    if (!Array.isArray(orders)) {
      throw new Error("Invalid orders data received from WooCommerce");
    }
    const pendingOrder = orders.find((order: WooOrder) => order.status === "pending");

    if (!pendingOrder) {
      return NextResponse.json({ error: "No pending order found" }, { status: 404 });
    }

    const result = await fetchWooCommerce(`wc/v3/orders/${pendingOrder.id}`, clearCartError, null, "PUT", { line_items: [] });
    return NextResponse.json({ message: "Cart cleared", data: result });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      const err = error as { message: string };
      console.error("Error clearing cart:", err.message);
    } else {
      console.error("Error clearing cart:", error);
    }
    return NextResponse.json({ error: clearCartError }, { status: 500 });
  }
}
