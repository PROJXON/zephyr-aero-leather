import fetchWooCommerce from "./fetchWooCommerce"
import stripeObj from "./stripeObj"

export default async function cartStripePayment(req) {
    try {
        const data = await req.json()
        const { amount, items, woo_order_id, payment_intent_id, user_local_time, shipping } = data

        let paymentIntent
        let metadata = {}

        if (items) metadata.items = JSON.stringify(items)
        if (woo_order_id) metadata.woo_order_id = woo_order_id
        if (user_local_time) metadata.user_local_time = user_local_time

        let paymentIntentObj = { metadata }
        if (amount) paymentIntentObj.amount = amount
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

            metadata.shipping = JSON.stringify(shipping)

            if (woo_order_id) {
                await fetchWooCommerce(`wc/v3/orders/${woo_order_id}`, "Failed to update shipping details", null, "PUT", {
                    shipping: {
                        first_name: name.first,
                        last_name: name.last,
                        address_1: address.line1,
                        address_2: address.line2,
                        city,
                        postcode: zipCode,
                        state,
                        country: "US"
                    }
                })
            }
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