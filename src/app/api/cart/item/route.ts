import { NextResponse } from "next/server";
import getCookieInfo from "../../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../../lib/fetchWooCommerce";
import type { WooOrder } from "../../../../../types/woocommerce";

function isWooOrder(obj: unknown): obj is WooOrder {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "id" in obj &&
    "line_items" in obj &&
    Array.isArray((obj as WooOrder).line_items)
  );
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { orderId, productId, quantity }: { orderId?: number; productId: number; quantity: number } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let finalOrderId = orderId;

    if (!finalOrderId) {
      const userData: unknown = await fetchWooCommerce("wp/v2/users/me", "Failed to fetch user info", token);
      if (typeof userData !== "object" || userData === null || !("id" in userData)) {
        return NextResponse.json({ error: "Invalid user data from WooCommerce" }, { status: 500 });
      }
      const newOrder: unknown = await fetchWooCommerce("wc/v3/orders", "Failed to create order", null, "POST", {
        customer_id: (userData as { id: number }).id,
        status: "pending",
        line_items: [{ product_id: productId, quantity }],
      });
      if (!isWooOrder(newOrder)) {
        return NextResponse.json({ error: "Invalid order data from WooCommerce" }, { status: 500 });
      }
      return NextResponse.json({ success: true, cart: newOrder, orderId: newOrder.id });
    }

    const orderData: unknown = await fetchWooCommerce(`wc/v3/orders/${finalOrderId}`, "Failed to fetch order");
    if (!isWooOrder(orderData)) {
      return NextResponse.json({ error: "Invalid order data from WooCommerce" }, { status: 500 });
    }

    const existingItem = orderData.line_items.find((item) => item.product_id === productId);

    const updatedLineItem = {
      id: existingItem?.id,
      product_id: productId,
      quantity,
    };

    const updatedCart: unknown = await fetchWooCommerce(`wc/v3/orders/${finalOrderId}`, "Failed to add item to cart", null, "PUT", { line_items: [updatedLineItem] });
    if (!isWooOrder(updatedCart)) {
      return NextResponse.json({ error: "Invalid updated cart data from WooCommerce" }, { status: 500 });
    }
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: unknown) {
    const message = error && typeof error === "object" && "message" in error ? (error as { message: string }).message : String(error);
    console.error("Error adding item to cart:", message);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const { orderId, productId }: { orderId: number; productId: number } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No order ID provided" }, { status: 400 });

    const orderData: unknown = await fetchWooCommerce(`wc/v3/orders/${orderId}`, "Failed to fetch order");
    if (!isWooOrder(orderData)) {
      return NextResponse.json({ error: "Invalid order data from WooCommerce" }, { status: 500 });
    }

    const updatedItems = orderData.line_items
      .filter((item) => item.product_id !== productId)
      .map((item) => ({ id: item.id, quantity: item.quantity }));

    await fetchWooCommerce("wc/v3/orders", "Failed to remove item", null, "PUT", { line_items: updatedItems });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error && typeof error === "object" && "message" in error ? (error as { message: string }).message : String(error);
    console.error("Error removing item:", message);
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}

export async function PUT(req: Request): Promise<Response> {
  const updateErrorMessage = "Failed to update cart item";

  try {
    const { orderId, line_items }: { orderId: number; line_items: Array<{ id: number; quantity: number }> } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No pending order found" }, { status: 400 });

    const updatedItems = line_items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    const updatedCart: unknown = await fetchWooCommerce('customcarteditor/v1/update-cart', updateErrorMessage, token, "POST", {
      orderId,
      line_items: updatedItems,
    });
    if (!isWooOrder(updatedCart)) {
      return NextResponse.json({ error: "Invalid updated cart data from WooCommerce" }, { status: 500 });
    }
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: unknown) {
    const message = error && typeof error === "object" && "message" in error ? (error as { message: string }).message : String(error);
    console.error("Error updating cart item:", message);
    return NextResponse.json({ error: updateErrorMessage }, { status: 500 });
  }
}