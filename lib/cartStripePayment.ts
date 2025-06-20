import syncAddress from "./syncAddress";
import stripeObj from "./stripeObj";
import type { StripePaymentRequestBody, StripePaymentIntent, StripePaymentResponse, StripePaymentIntentParams, Product } from "../types/types";
import { isStripeError } from "../types/types";
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

    let products: Product[] = [];
    if (items && items.length > 0) {
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

      // Handle WooCommerce order updates
      if (woo_order_id) {
        // Signed-in user: update existing order
        await syncAddress(shipping, woo_order_id, false, items, products, selectedShippingRateId, shippingAmount, taxAmount);
      } else {
        // Guest user: store order data in metadata for webhook to create order later
        metadata.shipping = JSON.stringify(shipping);
        metadata.billing = JSON.stringify(billing);
        metadata.selectedShippingRateId = selectedShippingRateId || "usps-priority-mail";
        metadata.shippingAmount = String(shippingAmount || 0);
        metadata.taxAmount = String(taxAmount || 0);
        metadata.guest_order = "true";
      }
    }

    if (billing && woo_order_id) {
      // Only sync billing for signed-in users (guest billing is stored in metadata)
      await syncAddress(billing, woo_order_id, true, items, products, selectedShippingRateId);
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
      if (isStripeError(stripeError)) {
        console.error('Stripe API error:', {
          message: stripeError.message,
          type: stripeError.type,
          code: stripeError.code
        });
      } else {
        console.error('Unknown Stripe API error:', stripeError);
      }
      throw stripeError;
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
  } catch (error: unknown) {
    console.error('Payment processing error:', error);
    
    let errorMessage = 'Unknown payment error';
    let errorType: string | undefined;
    let errorCode: string | undefined;
    let errorDetails: string | Record<string, unknown> | undefined;
    
    if (isStripeError(error)) {
      errorMessage = error.message;
      errorType = error.type;
      errorCode = error.code;
      errorDetails = error.raw as string | Record<string, unknown> | undefined;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    const response: StripePaymentResponse = {
      clientSecret: '',
      payment_intent_id: '',
      error: errorMessage,
      type: errorType,
      code: errorCode,
      details: errorDetails
    };
    return new Response(JSON.stringify(response), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
