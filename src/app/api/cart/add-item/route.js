import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/orders`;

export async function POST(req) {
  try {
    const { orderId, productId, quantity } = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "No pending order found" }, { status: 400 });
    }

    // Fetch the current pending order
    const orderResponse = await fetch(`${API_BASE_URL}/${orderId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (!orderResponse.ok) throw new Error("Failed to fetch order");

    const orderData = await orderResponse.json();

    // Merge existing line items with new item
    const existingItems = orderData.line_items || [];
    const itemIndex = existingItems.findIndex((item) => item.product_id === productId);

    if (itemIndex > -1) {
      existingItems[itemIndex].quantity += quantity; // Increase quantity if item exists
    } else {
      existingItems.push({ product_id: productId, quantity }); // Add new item
    }

    // Update order with merged line items
    const updateResponse = await fetch(`${API_BASE_URL}/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: existingItems }),
    });

    if (!updateResponse.ok) throw new Error("Failed to add item to cart");

    const updatedCart = await updateResponse.json();
    return NextResponse.json({ success: true, cart: updatedCart });

  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
