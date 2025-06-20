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
    let guestOrderId: number | undefined;

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

      // Create or update WooCommerce order for both signed-in and guest users
      if (woo_order_id) {
        // Signed-in user: update existing order
        await syncAddress(shipping, woo_order_id, false, items, products, selectedShippingRateId, shippingAmount, taxAmount);
      } else {
        // Guest user: create new order
        const subtotal = items?.reduce((sum, item) => {
          const product = products?.find(p => p.id === item.id);
          const price = product?.price || item.price || 0;
          return sum + (price * item.quantity);
        }, 0) || 0;

        const guestOrder = await fetchWooCommerce<WooOrder>("wc/v3/orders", "Failed to create guest order", null, "POST", {
          status: "pending",
          billing: {
            first_name: billing?.name.first || name.first,
            last_name: billing?.name.last || name.last,
            address_1: billing?.address.line1 || address.line1,
            address_2: billing?.address.line2 || address.line2 || "",
            city: billing?.city || city,
            state: billing?.state || state,
            postcode: billing?.zipCode || zipCode,
            country: "US"
          },
          shipping: {
            first_name: name.first,
            last_name: name.last,
            address_1: address.line1,
            address_2: address.line2 || "",
            city: city,
            state: state,
            postcode: zipCode,
            country: "US"
          },
          line_items: items?.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          })) || [],
          shipping_lines: shippingAmount ? [{
            method_title: selectedShippingRateId === "usps-priority-mail-express" ? "USPS Priority Mail Express" : "USPS Priority Mail",
            method_id: selectedShippingRateId || "usps-priority-mail",
            total: (shippingAmount / 100).toFixed(2),
            total_tax: "0.00"
          }] : [],
          tax_lines: taxAmount && taxAmount > 0 ? [{
            rate_code: `US-${state}-STATE-TAX`,
            rate_id: 1,
            label: `${state} State Tax`,
            compound: false,
            tax_total: (taxAmount / 100).toFixed(2),
            shipping_tax_total: "0.00",
            rate_percent: (taxAmount / subtotal) * 100
          }] : [],
          total: (amount / 100).toFixed(2),
          subtotal: (subtotal / 100).toFixed(2),
          shipping_total: shippingAmount ? (shippingAmount / 100).toFixed(2) : "0.00",
          total_tax: taxAmount ? (taxAmount / 100).toFixed(2) : "0.00",
          meta_data: [
            {
              key: "user_local_time",
              value: user_local_time || new Date().toISOString()
            },
            {
              key: "shipping_rate_id",
              value: selectedShippingRateId || "usps-priority-mail"
            },
            {
              key: "guest_order",
              value: "true"
            }
          ]
        });

        guestOrderId = guestOrder.id;
        metadata.woo_order_id = String(guestOrderId);
      }
    }

    if (billing && woo_order_id) {
      // Only sync billing for signed-in users (guest billing is set during order creation)
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
