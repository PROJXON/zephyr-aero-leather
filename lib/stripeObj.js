import Stripe from 'stripe'
const stripeObj = new Stripe(process.env.STRIPE_SECRET_KEY)
export default stripeObj