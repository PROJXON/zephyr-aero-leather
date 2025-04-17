import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function addToCart(amount, items, paymentIntentId = null) {
    try {
        let paymentIntent
        let paymentIntentObj = {
            amount,
            metadata: { items: JSON.stringify(items) }
        }

        if (paymentIntentId) {
            paymentIntent = await stripe.paymentIntents.update(paymentIntentId, paymentIntentObj)
        } else {
            paymentIntentObj.currency = 'usd'
            paymentIntentObj.automatic_payment_methods = { enabled: true }
            paymentIntent = await stripe.paymentIntents.create(paymentIntentObj)

            const orderStore = {}
            orderStore[paymentIntent.id] = { items, amount }
        }

        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
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