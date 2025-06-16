"use client";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import type { StripeFormProps } from "../../types/types";

export default function StripeForm({ clientSecret, formError, setFormError, validateShipping, setShippingErrors }: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const errors = validateShipping();
    if (Object.keys(errors).length > 0) {
      setShippingErrors(errors);
      setFormError("Fix the error(s) in the shipping form");
      return;
    }

    setFormError(null);
    setIsProcessing(true);

    if (!clientSecret) {
      setFormError("Missing client secret");
      setIsProcessing(false);
      return;
    }

    await fetch("/api/user-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_intent_id: clientSecret.split("_secret")[0],
        user_local_time: new Date().toISOString(),
      }),
    });

    const returnURL = `${window.location.origin}/payment-success`;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
      return_url: returnURL,
    });

    if (result.error) {
      setFormError(result.error.message || null);
      setIsProcessing(false);
    } else if (result.paymentIntent?.status === "succeeded") {
      sessionStorage.setItem("payment_success", "true");
      sessionStorage.setItem("payment_intent", result.paymentIntent.id);
      window.location.href = returnURL;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 lg:max-w-md mt-9">
      <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#333',
                fontFamily: 'inherit',
                '::placeholder': {
                  color: '#888',
                },
              },
              invalid: {
                color: '#e5424d',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <button
        type="submit"
        disabled={isProcessing}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
