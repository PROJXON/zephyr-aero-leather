import Stripe from 'stripe';
import fetchWooCommerce from "./fetchWooCommerce";
import stripeObj from "./stripeObj";
import { CartItem, StripePaymentRequestBody, ShippingDetails } from "../types/types";
import type { WooError } from "../types/woocommerce";

// Type for Stripe error objects
interface StripeAPIError {
  message: string;
  type?: string;
  code?: string;
  raw?: unknown;
}

export default async function cartStripePayment(req: Request): Promise<Response> {
  try {
    const data: StripePaymentRequestBody = await req.json();
    const { amount, currency, items, woo_order_id, payment_intent_id, user_local_time, shipping } = data;

    if (!amount || amount <= 0) {
      throw new Error('Invalid amount: Amount must be greater than 0');
    }

    if (!currency) {
      throw new Error('Currency is required');
    }

    let paymentIntent: Stripe.PaymentIntent | null = null;
    const metadata: Record<string, string> = {};

    if (items) metadata.items = JSON.stringify(items);
    if (woo_order_id) metadata.woo_order_id = String(woo_order_id);
    if (user_local_time) metadata.user_local_time = user_local_time;

    const paymentIntentObj: Partial<Stripe.PaymentIntentCreateParams> & { metadata: Record<string, string> } = {
      metadata,
      payment_method_types: ['card'],
      // currency and amount will be added below to ensure type safety
    };

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
          country: "US",
        },
      };

      if (woo_order_id) {
        try {
          await fetchWooCommerce(`wc/v3/orders/${woo_order_id}`, "Failed to update shipping details", null, "PUT", {
            shipping: {
              first_name: name.first,
              last_name: name.last,
              address_1: address.line1,
              address_2: address.line2 || "",
              city,
              postcode: zipCode,
              state,
              country: "US",
            },
            meta_data: [
              {
                key: "user_local_time",
                value: new Date().toISOString(),
              },
            ],
          });
        } catch (wooError: unknown) {
          if (wooError && typeof wooError === "object" && "message" in wooError) {
            const err = wooError as WooError;
            console.error('WooCommerce update error:', {
              message: err.message,
              status: err.data?.status,
              data: err.data,
            });
          } else {
            console.error('Unknown WooCommerce error:', wooError);
          }
          // Continue with Stripe payment even if WooCommerce update fails
        }
      }
    }

    // Stripe expects PaymentIntentCreateParams, not our custom type
    // Add required fields directly to ensure type safety
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      ...paymentIntentObj,
      amount, // required and validated above
      currency, // required and validated above
    };

    try {
      if (payment_intent_id) {
        paymentIntent = await stripeObj.paymentIntents.update(payment_intent_id, paymentIntentParams) as Stripe.PaymentIntent;
      } else {
        paymentIntent = await stripeObj.paymentIntents.create(paymentIntentParams) as Stripe.PaymentIntent;
      }
    } catch (stripeError: unknown) {
      if (stripeError && typeof stripeError === "object" && "message" in stripeError) {
        const err = stripeError as StripeAPIError;
        console.error('Stripe API error:', {
          message: err.message,
          type: err.type,
          code: err.code,
        });
        throw err;
      } else {
        console.error('Unknown Stripe error:', stripeError);
        throw stripeError;
      }
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
  } catch (err: unknown) {
    if (err && typeof err === "object" && "message" in err) {
      const error = err as StripeAPIError;
      console.error('Payment processing error:', {
        message: error.message,
        type: error.type,
        code: error.code,
      });
      return new Response(
        JSON.stringify({
          error: error.message,
          type: error.type,
          code: error.code,
          details: error.raw,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      console.error('Unknown payment processing error:', err);
      return new Response(
        JSON.stringify({ error: 'Unknown error occurred' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
}
