import { NextRequest } from "next/server";
import cartStripePayment from "../../../../lib/cartStripePayment";
import stripeObj from "../../../../lib/stripeObj";
import type { PaymentIntentResponse } from "../../../../types/types";

export const POST = cartStripePayment;
export const PUT = cartStripePayment;

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const payment_intent = searchParams.get('payment_intent');

  if (!payment_intent) {
    return new Response(JSON.stringify({ error: "Payment intent ID is required" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const paymentIntent = await stripeObj.paymentIntents.retrieve(payment_intent);

    const response: PaymentIntentResponse = {
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      items: paymentIntent.metadata?.items ? JSON.parse(paymentIntent.metadata.items) : [],
      wooOrderId: paymentIntent.metadata?.woo_order_id,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return new Response(JSON.stringify({ error: err.message || "Failed to retrieve payment intent" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}