import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
    try {
        const body = await req.json()
        const { amount } = body

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true }
        })

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
            items: [
                { name: 'Test Product A', price: 1000 },
                { name: 'Test Product B', price: 2000 }
            ]
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