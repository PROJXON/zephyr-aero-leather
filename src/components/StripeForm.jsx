"use client"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useState } from "react"

export default function StripeForm() {
    const stripe = useStripe()
    const elements = useElements()
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async e => {
        e.preventDefault()
        if (!stripe || !elements) return

        setIsProcessing(true)
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/payment-success` }
        })

        if (error) setError(error.message)
        setIsProcessing(false)
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