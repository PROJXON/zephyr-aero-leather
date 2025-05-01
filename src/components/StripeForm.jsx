"use client"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={isProcessing}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                {isProcessing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    )
}