import { NextResponse } from "next/server";
import getCookieInfo from "../../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../../lib/fetchWooCommerce";
import type { WordPressUser } from "../../../../../types/types";
import type { WooOrder } from "../../../../../types/woocommerce";

export async function POST(req: Request): Promise<Response> {
  try {
    const { orderId, productId, quantity }: { orderId?: number; productId: number; quantity: number } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const finalOrderId = orderId;

    if (!finalOrderId) {
      const userData = await fetchWooCommerce<WordPressUser>("wp/v2/users/me", "Failed to fetch user info", token);

      const newOrder = await fetchWooCommerce<WooOrder>("wc/v3/orders", "Failed to create order", null, "POST", {
        customer_id: userData.id,
        status: "pending",
        line_items: [{ product_id: productId, quantity }],
      });
      return NextResponse.json({ success: true, cart: newOrder, orderId: newOrder.id });
    }

    const orderData = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${finalOrderId}`, "Failed to fetch order");

    const existingItem = orderData.line_items.find((item) => item.product_id === productId);

    const updatedLineItem = {
      id: existingItem?.id,
      product_id: productId,
      quantity,
    };

    const updatedCart = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${finalOrderId}`, "Failed to add item to cart", null, "PUT", { line_items: [updatedLineItem] });
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: unknown) {
    console.error("Error adding item to cart:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    const { orderId, productId }: { orderId: number; productId: number } = await req.json();
    const [token] = await getCookieInfo();

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!orderId) return NextResponse.json({ error: "No order ID provided" }, { status: 400 });

    const orderData = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${orderId}`, "Failed to fetch order");

    const updatedItems = orderData.line_items
      .filter((item) => item.product_id !== productId)
      .map((item) => ({ id: item.id, quantity: item.quantity }));

    await fetchWooCommerce<WooOrder>("wc/v3/orders", "Failed to remove item", null, "PUT", { line_items: updatedItems });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error removing item:", error instanceof Error ? error.message : 'Unknown error');
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

    const updatedCart = await fetchWooCommerce<WooOrder>('customcarteditor/v1/update-cart', updateErrorMessage, token, "POST", {
      orderId,
      line_items: updatedItems,
    });
    return NextResponse.json({ success: true, cart: updatedCart });
  } catch (error: unknown) {
    console.error("Error updating cart item:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: updateErrorMessage }, { status: 500 });
  }
}