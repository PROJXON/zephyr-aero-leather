import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import fetchWooCommerce from '../../../../lib/fetchWooCommerce'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    const rawBody = await req.text()
    const headersList = await headers()
    const sig = headersList.get('stripe-signature')

    let event
    let responseBody = { received: true }
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 400 })
    }

    const paymentIntent = event.data.object
    const wooOrderId = paymentIntent.metadata.woo_order_id

    switch (event.type) {
        case 'payment_intent.processing':
            if (wooOrderId) {
                await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", { status: "processing" })
            }
        case 'payment_intent.succeeded':
            console.log(`Payment intent for ${paymentIntent.amount_received} was successful`)
            if (wooOrderId) {
                await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", { status: "completed" })
            }
            responseBody = { success: true }
            break
        case 'payment_intent.payment_failed':
            console.log(`Payment failed for ${paymentFailed.id}`)
            if (wooOrderId) {
                await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", { status: "failed" })
            }
            responseBody = { error: true }
            break
        default:
            break
    }

    return NextResponse.json(responseBody, { status: 200 })
}