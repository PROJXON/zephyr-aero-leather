import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/orders`

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    // Fetch user details
    const userResponse = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!userResponse.ok) throw new Error("Failed to fetch user data")

    const userData = await userResponse.json();
    const userId = userData.id;

    // Fetch pending orders
    const ordersResponse = await fetch(`${API_BASE_URL}?customer=${userId}&status=pending`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
      },
    })

    if (!ordersResponse.ok) throw new Error("Failed to fetch orders")

    const orders = await ordersResponse.json()
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

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch user details
    const userResponse = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userResponse.ok) throw new Error("Failed to fetch user");

    const userData = await userResponse.json();
    const userId = userData.id;

    // Fetch pending orders
    const ordersResponse = await fetch(`${API_BASE_URL}?customer=${userId}&status=pending`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (!ordersResponse.ok) throw new Error("Failed to fetch orders");

    const orders = await ordersResponse.json();
    const pendingOrder = orders.find(order => order.status === "pending");

    if (!pendingOrder) {
      return NextResponse.json({ error: "No pending order found" }, { status: 404 });
    }

    // Update the order to clear line items
    const clearResponse = await fetch(`${API_BASE_URL}/${pendingOrder.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: [] }),
    });

    if (!clearResponse.ok) throw new Error("Failed to clear cart");

    const result = await clearResponse.json();
    return NextResponse.json({ message: "Cart cleared", data: result });
  } catch (error) {
    console.error("Error clearing cart:", error.message);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
