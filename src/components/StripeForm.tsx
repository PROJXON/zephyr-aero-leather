"use client";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import type { StripeFormProps, ValidateAddressFunc, AddressErrors } from "../../types/types";

export default function StripeForm({
  clientSecret,
  formError,
  setFormError,
  validateShipping,
  setShippingErrors,
  validateBilling,
  setBillingErrors
}: StripeFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const checkAddressForm = (validateFunc: () => AddressErrors, setter: ValidateAddressFunc) => {
    const errors = validateFunc();
    if (Object.keys(errors).length > 0) {
      setter(errors);
      return true;
    }
    return false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const shippingError = checkAddressForm(validateShipping, setShippingErrors);
    if (shippingError) {
      setFormError("Fix the error(s) in the shipping form");
      return;
    }

    const billingError = checkAddressForm(validateBilling, setBillingErrors);
    if (billingError) {
      setFormError("Fix the error(s) in the billing form");
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
    <form onSubmit={handleSubmit} className="w-full">
      <div className="max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <div className="border border-gray-300 rounded-md p-4 bg-white shadow-sm mb-4">
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
                  ':-webkit-autofill': {
                    color: '#333',
                  },
                  iconColor: '#333',
                },
                invalid: {
                  color: '#e5424d',
                  iconColor: '#e5424d',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>

        {formError && <p className="text-red-500 text-sm mb-4">{formError}</p>}

        <button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-neutral-light text-neutral-dark px-4 py-2 rounded hover:bg-neutral-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
        <div className="text-sm text-gray-500 mt-4 italic">
          Use Card Number: 4242 4242 4242 4242 to test payment
        </div>
      </div>
    </form>
  );
}
