import { NextRequest } from "next/server";
import stripeObj from "../../../../lib/stripeObj";
import { getWooOrder, updateWooOrder } from "../../../../lib/updateWooCommerce";
import type { StripePaymentIntent } from "../../../../types/types";
import type { WooOrder } from "../../../../types/woocommerce";

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const intentId = searchParams.get("payment_intent_id");

  if (!intentId) {
    return new Response(JSON.stringify({ error: "Payment intent ID is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const intent = await stripeObj.paymentIntents.retrieve(intentId) as StripePaymentIntent;
    const wooOrderId = intent.metadata?.woo_order_id;
    let items: WooOrder['line_items'] = [];

    if (wooOrderId) {
      const wooOrder = await getWooOrder(Number(wooOrderId));
      items = wooOrder?.line_items || [];

      if (wooOrder?.status === "pending" && intent.status === "succeeded") {
        await updateWooOrder(Number(wooOrderId), { status: "completed" });
      }
    }

    return new Response(JSON.stringify({
      id: intent.id,
      status: intent.status,
      items,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("[Payment Intent Status API] Error:", err.message);
    return new Response(JSON.stringify({ error: "Failed to retrieve payment intent status" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
