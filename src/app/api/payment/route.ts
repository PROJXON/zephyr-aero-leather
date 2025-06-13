import cartStripePayment from '../../../../lib/cartStripePayment';
import stripeObj from '../../../../lib/stripeObj';
import type { NextRequest } from 'next/server';

export const POST = cartStripePayment;
export const PUT = cartStripePayment;

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const payment_intent = searchParams.get('payment_intent');

  try {
    const paymentIntent = await stripeObj.paymentIntents.retrieve(payment_intent!);

    return new Response(JSON.stringify({
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      items: paymentIntent.metadata?.items ? JSON.parse(paymentIntent.metadata.items) : [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}