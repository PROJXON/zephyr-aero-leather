import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import fetchWooCommerce from '../../../../lib/fetchWooCommerce';
import stripeObj from '../../../../lib/stripeObj';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
  const rawBody = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  let event;
  let responseBody: any = { received: true };
  try {
    event = stripeObj.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const paymentIntent = event.data.object;
  const wooOrderId = paymentIntent.metadata.woo_order_id;

  switch (event.type) {
    case 'payment_intent.processing':
      if (wooOrderId) {
        await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", { status: "processing" });
      }
      break;
    case 'payment_intent.succeeded':
      console.log(`Payment intent for ${paymentIntent.amount_received} was successful`);
      if (wooOrderId) {
        await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", {
          status: "completed",
          meta_data: [{
            key: "user_local_time",
            value: paymentIntent.metadata.user_local_time,
          }],
        });
      }
      responseBody = { success: true };
      break;
    case 'payment_intent.payment_failed':
      console.log(`Payment failed for ${event.data.object.id}`);
      if (wooOrderId) {
        await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", { status: "failed" });
      }
      responseBody = { error: true };
      break;
    default:
      break;
  }

  return NextResponse.json(responseBody, { status: 200 });
}