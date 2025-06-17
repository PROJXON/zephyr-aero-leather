import { NextResponse } from "next/server";
import stripeObj from "../../../../lib/stripeObj";
import type { StripeError } from "../../../../types/types";

export async function POST(request: Request) {
  try {
    const { payment_intent_id, user_local_time } = await request.json();

    if (!payment_intent_id) {
      throw new Error("Missing payment_intent_id");
    }

    // Update the payment intent with the user's local time
    await stripeObj.paymentIntents.update(payment_intent_id, {
      metadata: {
        user_local_time,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error updating payment intent metadata:", error);
    const err = error as StripeError;
    return NextResponse.json(
      { error: err.message || "Failed to update payment intent metadata" },
      { status: 500 }
    );
  }
}