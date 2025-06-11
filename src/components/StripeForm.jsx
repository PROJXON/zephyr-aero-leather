"use client"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import { useState } from "react"

export default function StripeForm({ paymentIntentId }) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!stripe || !elements) return

    setIsProcessing(true)

    if (!paymentIntentId) {
      setError("Missing payment intent ID")
      setIsProcessing(false)
      return
    }

    await fetch("/api/user-time", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payment_intent_id: paymentIntentId,
        user_local_time: new Date().toISOString()
      })
    })

    const returnURL = `${window.location.origin}/payment-success`
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnURL },
      redirect: "always"
    })

    if (error) {
      setError(error.message)
      setIsProcessing(false)
    }
  }

  return (<form onSubmit={handleSubmit} className="space-y-4 lg:max-w-md">
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
          hidePostalCode: true, // optional, keep it if you don't need zip code
        }}
      />
    </div>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    <button
      type="submit"
      disabled={isProcessing}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
    >
      {isProcessing ? 'Processing...' : 'Pay Now'}
    </button>
  </form>)
}
