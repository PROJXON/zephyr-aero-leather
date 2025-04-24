import { NextResponse } from "next/server"
import getCookieInfo from "../../../../../lib/getCookieInfo"
import fetchWooCommerce from "../../../../../lib/fetchWooCommerce"

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
      const userData = await fetchWooCommerce("/wp/v2/users/me", "Failed to fetch user info", token)

      // Create a new pending order
      const newOrder = await fetchWooCommerce("wc/v3/orders", "Failed to create order", null, "POST", {
        customer_id: userData.id,
        status: "pending",
        line_items: [{ product_id: productId, quantity }]
      })
      return NextResponse.json({ success: true, cart: newOrder, orderId: newOrder.id })
    }

    // Fetch the current pending order
    const orderData = await fetchWooCommerce(`wc/v3/orders/${finalOrderId}`, "Failed to fetch order")

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

    const updatedCart = await fetchWooCommerce("wc/v3/orders", "Failed to add item to cart", null, "PUT", { line_items: [updatedLineItem] })
    return NextResponse.json({ success: true, cart: updatedCart })

  } catch (error) {
    console.error("Error adding item to cart:", error.message)
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { orderId, productId } = await req.json();
    const [token] = await getCookieInfo()

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No order ID provided" }, { status: 400 });

    // Fetch current order
    const orderData = await fetchWooCommerce(`wc/v3/orders/${orderId}`, "Failed to fetch order")

    // ❌ Remove the item and ✅ sanitize
    const updatedItems = orderData.line_items
      .filter((item) => item.product_id !== productId)
      .map((item) => ({ id: item.id, quantity: item.quantity }));

    // ✅ PUT sanitized line_items back to Woo
    await fetchWooCommerce("wc/v3/orders", "Failed to remove item", null, "PUT", { line_items: updatedItems })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing item:", error.message);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}

export async function PUT(req) {
  const updateErrorMessage = "Failed to update cart item"

  try {
    const { orderId, line_items } = await req.json()
    const [token] = await getCookieInfo()

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No pending order found" }, { status: 400 })

    // Fetch current order
    const orderData = await fetchWooCommerce(`wc/v3/orders/${orderId}`, "Failed to fetch order")

    // ✅ Send only id and quantity, WooCommerce rejects extra fields
    const updatedItems = orderData.line_items.map(item => {
      const match = line_items.find((li) => li.id === item.id);
      return match ? { id: item.id, quantity: match.quantity } : { id: item.id, quantity: item.quantity };
    })

    const updatedCart = await fetchWooCommerce("wc/v3/orders", updateErrorMessage, token, "PUT", { line_items: updatedItems })
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error) {
    console.error("Error updating cart item:", error.message);
    return NextResponse.json({ error: updateErrorMessage }, { status: 500 });
  }
}
