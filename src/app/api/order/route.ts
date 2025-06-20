import { NextResponse } from "next/server";
import getCookieInfo from "../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";
import type { WooOrder } from "../../../../types/woocommerce";

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('id');
  const paymentIntentId = searchParams.get('payment_intent');
  
  // If specific order lookup is requested (for guests)
  if (orderId && paymentIntentId) {
    try {
      const order = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${orderId}`, "Error fetching order");
      
      // Verify this order belongs to the payment intent (security check)
      const hasMatchingPaymentIntent = order.meta_data?.some(meta => 
        meta.key === "stripe_payment_intent_id" && meta.value === paymentIntentId
      );
      
      if (!hasMatchingPaymentIntent) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      
      return NextResponse.json({ orders: [order] });
    } catch (error) {
      console.error("Error fetching guest order:", error);
      return NextResponse.json({ error: "Error fetching order" }, { status: 500 });
    }
  }
  
  // Logic for signed-in users (fetch all orders)
  const [token] = await getCookieInfo();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ordersError = "Error fetching orders";

  try {
    // Fetch all orders without status filter to get completed and other statuses
    const orders = await fetchWooCommerce("wc/v3/orders?per_page=100", ordersError, token);
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: ordersError }, { status: 500 });
  }
}
