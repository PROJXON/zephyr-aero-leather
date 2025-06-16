import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set in the environment.");
}

const stripeObj = new Stripe(secretKey, {
  apiVersion: "2025-03-31.basil",
});

export default stripeObj;
