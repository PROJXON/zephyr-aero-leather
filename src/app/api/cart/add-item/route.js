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

    let finalOrderId = orderId;

    // 🧠 If no order exists, create one first
    if (!finalOrderId) {
      // Get the current user info
      const userRes = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) throw new Error("Failed to fetch user info");
      const userData = await userRes.json();

      // Create a new pending order
      const createRes = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: userData.id,
          status: "pending",
          line_items: [{ product_id: productId, quantity }],
        }),
      });

      if (!createRes.ok) throw new Error("Failed to create order");
      const newOrder = await createRes.json();
      return NextResponse.json({ success: true, cart: newOrder, orderId: newOrder.id });
    }

    // Fetch the current pending order
    const orderResponse = await fetch(`${API_BASE_URL}/${finalOrderId}`, {
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

    console.log("Adding to existing order:", finalOrderId);
    console.log("Existing line items:", existingItems);

    const updatedItems = existingItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
    }));

    // Update order with merged line items
    const updateResponse = await fetch(`${API_BASE_URL}/${finalOrderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: updatedItems }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.error("WooCommerce response error:", errorText);
      throw new Error("Failed to add item to cart");
    }    

    const updatedCart = await updateResponse.json();
    return NextResponse.json({ success: true, cart: updatedCart });

  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
