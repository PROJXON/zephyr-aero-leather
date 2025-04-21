"use client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from "@/app/context/CartContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"

export default function PaymentDetails({ products }) {
    const searchParams = useSearchParams()
    const payment_intent = searchParams.get('payment_intent')
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [total, setTotal] = useState(0)

    const { clearCart } = useCart()

    useEffect(() => {
        const alreadyCleared = localStorage.getItem("cartCleared")

        if (!alreadyCleared) {
            clearCart()
            localStorage.setItem("cartCleared", "true")
        }
    }, [])

    useEffect(() => {
        if (payment_intent) {
            fetch(`/api/payment?payment_intent=${payment_intent}`)
                .then(res => res.json())
                .then(data => {
                    setPaymentDetails(data)
                    setTotal(calculateTotal(data.items, products))
                })
                .catch(err => console.error(err))
        }
    }, [payment_intent])

    return (<>
        {paymentDetails ? (<OrderSummary
            cartItems={paymentDetails.items}
            products={products}
            total={total}
        />) : <p>Loading your payment details...</p>}
    </>)
}