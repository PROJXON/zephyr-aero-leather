import { NextResponse } from "next/server"
import getCookieInfo from "../../../../../lib/getCookieInfo"

const API_BASE_URL = `${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/orders`

export async function POST(req) {
  try {
    const { orderId, productId, quantity } = await req.json()
    const [token] = await getCookieInfo()

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let finalOrderId = orderId

    // 🧠 If no order exists, create one first
    if (!finalOrderId) {
      // Get the current user info
      const userRes = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!userRes.ok) throw new Error("Failed to fetch user info")
      const userData = await userRes.json()

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
      })

      if (!createRes.ok) throw new Error("Failed to create order")
      const newOrder = await createRes.json()
      return NextResponse.json({ success: true, cart: newOrder, orderId: newOrder.id })
    }

    // Fetch the current pending order
    const orderResponse = await fetch(`${API_BASE_URL}/${finalOrderId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
      },
    })

    if (!orderResponse.ok) throw new Error("Failed to fetch order")

    const orderData = await orderResponse.json()

    // ✅ Find existing Woo line item (if it exists)
    const existingItem = orderData.line_items.find((item) => item.product_id === productId);

    console.log("Adding to existing order:", finalOrderId);
    console.log("Client-sent quantity:", quantity);

    const finalQuantity = (existingItem?.quantity || 0) + quantity;

    const updatedLineItem = {
      id: existingItem?.id,
      product_id: productId,
      quantity: finalQuantity,
    };

    const updateResponse = await fetch(`${API_BASE_URL}/${finalOrderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: [updatedLineItem] }),
    });

    if (!updateResponse.ok) {
      const errorText = await updateResponse.text()
      console.error("WooCommerce response error:", errorText)
      throw new Error("Failed to add item to cart")
    }

    const updatedCart = await updateResponse.json()
    return NextResponse.json({ success: true, cart: updatedCart })

  } catch (error) {
    console.error("Error adding item to cart:", error.message)
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { orderId, productId } = await req.json();
    const token = getCookieInfo()[0]

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No order ID provided" }, { status: 400 });

    // Fetch current order
    const orderRes = await fetch(`${API_BASE_URL}/${orderId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (!orderRes.ok) throw new Error("Failed to fetch order");
    const orderData = await orderRes.json();

    // ❌ Remove the item and ✅ sanitize
    const updatedItems = orderData.line_items
      .filter((item) => item.product_id !== productId)
      .map((item) => ({ id: item.id, quantity: item.quantity }));

    // ✅ PUT sanitized line_items back to Woo
    const updateRes = await fetch(`${API_BASE_URL}/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: updatedItems }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("Woo DELETE error:", errorText);
      throw new Error("Failed to remove item");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing item:", error.message);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}



export async function PUT(req) {
  try {
    const { orderId, line_items } = await req.json()
    const token = getCookieInfo()[0]

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No pending order found" }, { status: 400 });

    // Fetch current order
    const orderRes = await fetch(`${API_BASE_URL}/${orderId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
      },
    });

    if (!orderRes.ok) throw new Error("Failed to fetch order");

    const orderData = await orderRes.json();

    // ✅ Send only id and quantity, WooCommerce rejects extra fields
    const updatedItems = orderData.line_items.map((item) => {
      const match = line_items.find((li) => li.id === item.id);
      return match ? { id: item.id, quantity: match.quantity } : { id: item.id, quantity: item.quantity };
    });

    const updateRes = await fetch(`${API_BASE_URL}/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ line_items: updatedItems }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error("Woo PUT error:", errorText);
      throw new Error("Failed to update cart item");
    }

    const updatedCart = await updateRes.json();
    return NextResponse.json({ success: true, cart: updatedCart });

  } catch (error) {
    console.error("Error updating cart item:", error.message);
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 });
  }
}
