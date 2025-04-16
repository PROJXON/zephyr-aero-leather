import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    try {
        const { amount, items } = await req.json()

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            metadata: { items: JSON.stringify(items) },
            automatic_payment_methods: { enabled: true }
        })

        //Code to empty the cart

        return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
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