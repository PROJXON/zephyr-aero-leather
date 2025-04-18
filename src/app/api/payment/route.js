import Stripe from 'stripe'
import addToCart from '../../../../lib/addToCart'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    const { amount, items } = await req.json()
    return addToCart(amount, items)
}

export async function PUT(req) {
    const { amount, items, payment_intent_id } = await req.json()
    return addToCart(amount, items, payment_intent_id)
}

export async function GET(req) {
    const { searchParams } = new URL(req.url)
    const payment_intent = searchParams.get('payment_intent')

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent)

        return new Response(JSON.stringify({
            amount: paymentIntent.amount,
            status: paymentIntent.status,
            items: paymentIntent.metadata?.items ? JSON.parse(paymentIntent.metadata.items) : []
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}