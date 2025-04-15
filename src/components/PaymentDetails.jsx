"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentDetails() {
    const searchParams = useSearchParams()
    const payment_intent = searchParams.get('payment_intent')
    const [paymentDetails, setPaymentDetails] = useState(null)

    useEffect(() => {
        if (payment_intent) {
            fetch(`/api/payment?payment_intent=${payment_intent}`)
                .then(res => res.json())
                .then(data => setPaymentDetails(data))
                .catch(err => console.error(err))
        }
    }, [payment_intent])

    return (<>
        {paymentDetails ? (<>
            <h2>Order Summary:</h2>
            <ul>
                {paymentDetails.items.map((item, index) => (
                    <li key={index}>{item.name} – ${item.price / 100}</li>
                ))}
            </ul>
            <p><strong>Total:</strong> ${paymentDetails.amount_total / 100}</p>
        </>) : <p>Loading your payment details...</p>}
    </>)
}