import { NextResponse } from "next/server"
import stripe from "../../../../lib/stripeObj"
import fetchWooCommerce from "../../../../lib/fetchWooCommerce"

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const clientSecret = searchParams.get("client_secret")

  if (!clientSecret) return NextResponse.json({ error: "Missing client_secret" }, { status: 400 })

  const intentId = clientSecret.split("_secret")[0]

  try {
    const intent = await stripe.paymentIntents.retrieve(intentId)

    const wooOrderId = intent.metadata?.woo_order_id
    let items = []

    if (wooOrderId) {
      const wooOrder = await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`)
      items = wooOrder?.line_items || []
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
