import { NextResponse } from "next/server";
import stripeObj from "../../../../lib/stripeObj";

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
  } catch (error: any) {
    console.error("Error updating payment intent metadata:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update payment intent metadata" },
      { status: 500 }
    );
  }
}