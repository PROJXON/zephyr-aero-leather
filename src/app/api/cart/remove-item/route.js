import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/orders`;

export async function POST(req) {
  try {
    const { productId } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch pending order
    const ordersResponse = await fetch(`${API_BASE_URL}?status=pending`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
      },
    });

    const orders = await ordersResponse.json();
    if (orders.length === 0) return NextResponse.json({ error: "Cart is empty" });

    const orderId = orders[0].id;
    const updatedItems = orders[0].line_items.filter(item => item.product_id !== productId);

    // Update order
    await fetch(`${API_BASE_URL}/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: updatedItems }),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Error removing item:", error.message);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}
