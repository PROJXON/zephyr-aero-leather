import { NextResponse } from "next/server"
import stripe from "../../../../lib/stripeObj"
import { getWooOrder, updateWooOrder } from "../../../../lib/updateWooCommerce"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const intentId = searchParams.get("payment_intent_id")

  if (!intentId) {
    return NextResponse.json({ error: "Missing payment_intent_id" }, { status: 400 })
  }

  try {
    const intent = await stripe.paymentIntents.retrieve(intentId)
    const wooOrderId = intent.metadata?.woo_order_id
    console.log("Intent metadata:", intent.metadata);
    let items = []

    if (wooOrderId) {
      const wooOrder = await getWooOrder(wooOrderId)
      items = wooOrder?.line_items || []

      if (wooOrder.status === "pending" && intent.status === "succeeded") {
        await updateWooOrder(wooOrderId, { status: "completed" })
      }
    }

    return NextResponse.json({
      id: intent.id,
      status: intent.status,
      items,
    })
  } catch (err) {
    console.error("Failed to fetch payment intent or WooCommerce order", err)
    return NextResponse.json({ error: true }, { status: 500 })
  }
}
