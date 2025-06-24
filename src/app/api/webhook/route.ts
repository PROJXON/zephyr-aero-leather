import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import fetchWooCommerce from '../../../../lib/fetchWooCommerce';
import stripeObj from '../../../../lib/stripeObj';
import type { NextRequest } from 'next/server';
import type Stripe from 'stripe';
import type { WebhookResponse, Product } from '../../../../types/types';
import type { WooOrder } from '../../../../types/woocommerce';

export async function POST(req: NextRequest): Promise<Response> {
  const rawBody = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing Stripe signature header' }, { status: 400 });
  }

  let event;
  let responseBody: WebhookResponse = { received: true };
  try {
    event = stripeObj.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: unknown) {
    const err = error as { message: string };
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const wooOrderId = paymentIntent.metadata?.woo_order_id;

  switch (event.type) {
    case 'payment_intent.processing':
      if (wooOrderId) {
        await fetchWooCommerce(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", { status: "processing" });
      }
      break;
    case 'payment_intent.succeeded':
      if (wooOrderId) {
        // Signed-in user: update existing order
        const currentOrder = await fetchWooCommerce<WooOrder>(`wc/v3/orders/${wooOrderId}`, "Failed to fetch order");
        
        await fetchWooCommerce<WooOrder>(`wc/v3/orders/${wooOrderId}`, "Failed to update status", null, "PUT", {
          status: "completed",
          meta_data: [{
            key: "user_local_time",
            value: paymentIntent.metadata?.user_local_time,
          }],
          total: currentOrder.total,
          subtotal: currentOrder.subtotal,
          shipping_total: currentOrder.shipping_total,
          total_tax: currentOrder.total_tax,
          shipping_lines: currentOrder.shipping_lines,
          tax_lines: currentOrder.tax_lines
        });
      } else if (paymentIntent.metadata?.guest_order === "true") {
        // Guest user: create new order from metadata
        const compactItems = JSON.parse(paymentIntent.metadata.i || "[]") as Array<{id: number; q: number}>;
        const compactShipping = JSON.parse(paymentIntent.metadata.s || "{}") as {n: string; a: string; a2: string; c: string; s: string; z: string};
        const compactBilling = paymentIntent.metadata.b ? JSON.parse(paymentIntent.metadata.b) as {n: string; a: string; a2: string; c: string; s: string; z: string} : null;
        const selectedShippingRateId = paymentIntent.metadata.selectedShippingRateId || "usps-priority-mail";
        const shippingAmount = parseInt(paymentIntent.metadata.shippingAmount || "0");
        const taxAmount = parseInt(paymentIntent.metadata.taxAmount || "0");
        const subtotal = parseFloat(paymentIntent.metadata.subtotal || "0");
        
        // Create line items using stored subtotal
        const lineItems = compactItems.map((item) => {
          // Calculate item subtotal proportionally based on quantity
          const itemSubtotal = (subtotal / compactItems.reduce((sum, i) => sum + i.q, 0)) * item.q;
          
          return {
            product_id: item.id,
            quantity: item.q,
            subtotal: itemSubtotal.toFixed(2),
            total: itemSubtotal.toFixed(2),
            total_tax: "0.00"
          };
        });

        const guestOrder = await fetchWooCommerce<WooOrder>("wc/v3/orders", "Failed to create guest order", null, "POST", {
          status: "completed",
          billing: compactBilling ? {
            first_name: compactBilling.n.split(' ')[0] || "",
            last_name: compactBilling.n.split(' ').slice(1).join(' ') || "",
            address_1: compactBilling.a,
            address_2: compactBilling.a2,
            city: compactBilling.c,
            state: compactBilling.s,
            postcode: compactBilling.z,
            country: "US"
          } : {
            first_name: compactShipping.n.split(' ')[0] || "",
            last_name: compactShipping.n.split(' ').slice(1).join(' ') || "",
            address_1: compactShipping.a,
            address_2: compactShipping.a2,
            city: compactShipping.c,
            state: compactShipping.s,
            postcode: compactShipping.z,
            country: "US"
          },
          shipping: {
            first_name: compactShipping.n.split(' ')[0] || "",
            last_name: compactShipping.n.split(' ').slice(1).join(' ') || "",
            address_1: compactShipping.a,
            address_2: compactShipping.a2,
            city: compactShipping.c,
            state: compactShipping.s,
            postcode: compactShipping.z,
            country: "US"
          },
          line_items: lineItems,
          shipping_lines: shippingAmount > 0 ? [{
            method_title: selectedShippingRateId === "usps-priority-mail-express" ? "USPS Priority Mail Express" : "USPS Priority Mail",
            method_id: selectedShippingRateId,
            total: (shippingAmount / 100).toFixed(2),
            total_tax: "0.00"
          }] : [],
          tax_lines: taxAmount > 0 ? [{
            rate_code: `US-${compactShipping.s}-STATE-TAX`,
            rate_id: 1,
            label: `${compactShipping.s} State Tax`,
            compound: false,
            tax_total: (taxAmount / 100).toFixed(2),
            shipping_tax_total: "0.00",
            rate_percent: subtotal > 0 ? (taxAmount / (subtotal * 100)) * 100 : 0
          }] : [],
          total: (paymentIntent.amount / 100).toFixed(2),
          subtotal: (subtotal / 100).toFixed(2),
          shipping_total: shippingAmount > 0 ? (shippingAmount / 100).toFixed(2) : "0.00",
          total_tax: taxAmount > 0 ? (taxAmount / 100).toFixed(2) : "0.00",
          meta_data: [
            {
              key: "user_local_time",
              value: paymentIntent.metadata?.user_local_time || new Date().toISOString()
            },
            {
              key: "shipping_rate_id",
              value: selectedShippingRateId
            },
            {
              key: "guest_order",
              value: "true"
            },
            {
              key: "stripe_payment_intent_id",
              value: paymentIntent.id
            }
          ]
        });

        // Update Stripe PaymentIntent metadata to include the WooCommerce order ID
        await stripeObj.paymentIntents.update(paymentIntent.id, {
          metadata: {
            ...paymentIntent.metadata,
            woo_order_id: String(guestOrder.id)
          }
        });
      }
      responseBody = { success: true };
      break;
    case 'payment_intent.payment_failed':
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