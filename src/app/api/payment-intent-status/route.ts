import { NextResponse } from "next/server";
import stripe from "../../../../lib/stripeObj";
import { getWooOrder, updateWooOrder } from "../../../../lib/updateWooCommerce";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const intentId = searchParams.get("payment_intent_id");

  if (!intentId) {
    return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 });
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    const wooOrderId = intent.metadata?.woo_order_id;
    let items: any[] = [];

    if (wooOrderId) {
      const wooOrder = await getWooOrder(Number(wooOrderId));
      items = wooOrder?.line_items || [];

      if (wooOrder.status === "pending" && intent.status === "succeeded") {
        await updateWooOrder(Number(wooOrderId), { status: "completed" });
      }
    }

    return NextResponse.json({
      id: intent.id,
      status: intent.status,
      items,
    });
  } catch (err: any) {
    console.error("Failed to fetch payment intent or WooCommerce order", err);
    return NextResponse.json({ error: true }, { status: 500 });
  }
}
