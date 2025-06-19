import syncAddress from "./syncAddress";
import stripeObj from "./stripeObj";
import type { StripePaymentRequestBody, StripePaymentIntent, StripeError, StripePaymentResponse, StripePaymentIntentParams, Product } from "../types/types";
import fetchWooCommerce from "./fetchWooCommerce";

export default async function cartStripePayment(req: Request): Promise<Response> {
  try {
    const data: StripePaymentRequestBody = await req.json();
    const { amount, currency, items, woo_order_id, payment_intent_id, user_local_time, shipping, billing, selectedShippingRateId, shippingAmount, taxAmount } = data;

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

    const basePaymentIntentObj: StripePaymentIntentParams = {
      amount,
      metadata,
      currency: currency || 'usd',
    };

    // Fetch products if we have items
    let products: Product[] = [];
    if (items && items.length > 0) {
      // Fetch all products with pagination
      let allProducts: Product[] = [];
      let page = 1;
      const perPage = 100;
      
      while (true) {
        const productsPage = await fetchWooCommerce<Product[]>(`wc/v3/products?per_page=${perPage}&page=${page}`, 'Failed to fetch products');
        if (productsPage.length === 0) break;
        
        allProducts = allProducts.concat(productsPage);
        if (productsPage.length < perPage) break;
        page++;
      }
      
      products = allProducts;
    }

    if (shipping) {
      const { name, address, city, zipCode, state } = shipping;
      basePaymentIntentObj.shipping = {
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

      // Only sync with WooCommerce if we have a woo_order_id (signed-in user)
      if (woo_order_id) {
        // Pass frontend-calculated amounts to syncAddress
        await syncAddress(shipping, woo_order_id, false, items, products, selectedShippingRateId, shippingAmount, taxAmount);
      } else {
        // For guest users, store shipping in metadata
        metadata.shipping = JSON.stringify(shipping);
      }
    }

    if (billing) {
      // Only sync with WooCommerce if we have a woo_order_id (signed-in user)
      if (woo_order_id) {
        await syncAddress(billing, woo_order_id, true, items, products, selectedShippingRateId);
      } else {
        // For guest users, store billing in metadata
        metadata.billing = JSON.stringify(billing);
      }
    }

    try {
      if (payment_intent_id) {
        paymentIntent = await stripeObj.paymentIntents.update(payment_intent_id, basePaymentIntentObj) as StripePaymentIntent;
      } else {
        paymentIntent = await stripeObj.paymentIntents.create({
          ...basePaymentIntentObj,
          payment_method_types: ['card']
        }) as StripePaymentIntent;
      }
    } catch (stripeError: unknown) {
      const error = stripeError as StripeError;
      console.error('Stripe API error:', {
        message: error.message,
        type: error.type,
        code: error.code
      });
      throw error;
    }

    if (!paymentIntent) {
      throw new Error('Failed to create or update payment intent');
    }

    const response: StripePaymentResponse = {
      clientSecret: paymentIntent.client_secret!,
      payment_intent_id: paymentIntent.id,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    console.error('Payment processing error:', err);
    const error = err as StripeError;
    const response: StripePaymentResponse = {
      clientSecret: '',
      payment_intent_id: '',
      error: error.message,
      type: error.type,
      code: error.code,
      details: error.raw as string | Record<string, unknown> | undefined
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
