"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from "@/app/context/CartContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"

export default function PaymentDetails({ products }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [paymentIntentId, setPaymentIntentId] = useState(null)
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [total, setTotal] = useState(0)
    const [allowed, setAllowed] = useState(false)
    const { clearCart } = useCart()
    const queryIntent = searchParams.get("payment_intent")

    useEffect(() => {
        const paid = sessionStorage.getItem("payment_success")
        const intent = sessionStorage.getItem("payment_intent") || queryIntent

        if (paid === "true" || queryIntent) {
            sessionStorage.removeItem("payment_success")
            sessionStorage.removeItem("payment_intent")
            setPaymentIntentId(intent)
            setAllowed(true)

            const alreadyCleared = localStorage.getItem("cartCleared")
            if (!alreadyCleared) {
                clearCart()
                localStorage.setItem("cartCleared", "true")
            }

            setTimeout(() => localStorage.removeItem("cartCleared"), 1000)
        } else router.replace("/")
    }, [])

    useEffect(() => {
        if (paymentIntentId) {
            fetch(`/api/payment?payment_intent=${paymentIntentId}`)
                .then(res => res.json())
                .then(data => {
                    setPaymentDetails(data)
                    setTotal(calculateTotal(data.items, products))
                })
                .catch(err => console.error(err))
        }
    }, [paymentIntentId])

    return (<>
        {allowed && (<div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
            <p>Thank you for your purchase.</p>
            {paymentDetails ? (<OrderSummary
                cartItems={paymentDetails.items}
                products={products}
                total={total}
            />) : <p>Loading your payment details...</p>}
        </div>)}
    </>)
}