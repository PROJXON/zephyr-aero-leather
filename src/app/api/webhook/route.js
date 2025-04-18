import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

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

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object
            console.log(`Payment intent for ${paymentIntent.amount_received} was successful`)
            //Update order status in WooCommerce to 'completed' and empty the cart
            responseBody = { success: true }
            break
        case 'payment_intent.payment_failed':
            const paymentFailed = event.data.object
            console.log(`Payment failed for ${paymentFailed.id}`)
            //Update order status in WooCommerce to 'failed'
            responseBody = { error: true }
            break
        default:
            break
    }

    return NextResponse.json(responseBody, { status: 200 })
}