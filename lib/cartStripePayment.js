import syncAddress from "./syncAddress"
import stripeObj from "./stripeObj"

export default async function cartStripePayment(req) {
    try {
        const data = await req.json()
        const { amount, items, woo_order_id, payment_intent_id, user_local_time, shipping, billing } = data

        let paymentIntent
        let metadata = {}

        if (items) metadata.items = JSON.stringify(items)
        if (woo_order_id) metadata.woo_order_id = woo_order_id
        if (user_local_time) metadata.user_local_time = user_local_time

        let paymentIntentObj = { metadata }
        if (amount) paymentIntentObj.amount = amount
        if (billing) await syncAddress(billing, woo_order_id, true)
        if (shipping) {
            const { name, address, city, zipCode, state } = shipping

            paymentIntentObj.shipping = {
                name: `${name.first} ${name.last}`,
                address: {
                    line1: address.line1,
                    line2: address.line2,
                    city,
                    postal_code: zipCode,
                    state,
                    country: "US"
                }
            }

            console.log(paymentIntentObj.shipping)

            await syncAddress(shipping, woo_order_id, false)
        }

        if (payment_intent_id) {
            paymentIntent = await stripeObj.paymentIntents.update(payment_intent_id, paymentIntentObj)
        } else {
            paymentIntentObj.currency = 'usd'
            paymentIntentObj.automatic_payment_methods = { enabled: true }
            paymentIntent = await stripeObj.paymentIntents.create(paymentIntentObj)
        }

        return new Response(JSON.stringify({
            clientSecret: paymentIntent.client_secret,
            payment_intent_id: paymentIntent.id
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