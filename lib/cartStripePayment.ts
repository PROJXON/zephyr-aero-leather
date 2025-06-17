import fetchWooCommerce from "./fetchWooCommerce";
import syncAddress from "./syncAddress";
import stripeObj from "./stripeObj";
import { StripePaymentRequestBody, StripePaymentIntent } from "../types/types";

export default async function cartStripePayment(req: Request): Promise<Response> {
  try {
    const data: StripePaymentRequestBody = await req.json();
    const { amount, currency, items, woo_order_id, payment_intent_id, user_local_time, shipping, billing } = data;

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount: Amount must be greater than 0');
    }

    if (!currency) {
      throw new Error('Currency is required');
    }

    let paymentIntent: StripePaymentIntent | null = null;
    const metadata: Record<string, string> = {};

    if (items) metadata.items = JSON.stringify(items);
    if (woo_order_id) metadata.woo_order_id = String(woo_order_id);
    if (user_local_time) metadata.user_local_time = user_local_time;

    const paymentIntentObj: Partial<StripePaymentIntent> & { metadata: Record<string, string> } = {
      metadata,
      currency: currency || 'usd',
      payment_method_types: ['card']
    };

    if (amount) paymentIntentObj.amount = amount;

    if (shipping) {
      const { name, address, city, zipCode, state } = shipping;
      paymentIntentObj.shipping = {
        name: `${name.first} ${name.last}`,
        address: {
          line1: address.line1,
          line2: address.line2 || undefined,
          city,
          postal_code: zipCode,
          state,
          country: "US"
        }
      };

      await syncAddress(shipping, woo_order_id, false);
    }

    if (billing) await syncAddress(billing, woo_order_id, true);

    // Stripe expects PaymentIntentCreateParams, not our custom type
    const paymentIntentParams: any = { ...paymentIntentObj };

    try {
      if (payment_intent_id) {
        paymentIntent = (await stripeObj.paymentIntents.update(payment_intent_id, paymentIntentParams)) as any;
      } else {
        paymentIntent = (await stripeObj.paymentIntents.create(paymentIntentParams)) as any;
      }
    } catch (stripeError: any) {
      console.error('Stripe API error:', {
        message: stripeError.message,
        type: stripeError.type,
        code: stripeError.code
      });
      throw stripeError;
    }

    if (!paymentIntent) {
      throw new Error('Failed to create or update payment intent');
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error('Payment processing error:', {
      message: err.message,
      type: err.type,
      code: err.code
    });
    return new Response(JSON.stringify({
      error: err.message,
      type: err.type,
      code: err.code,
      details: err.raw
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
