"use client"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCart } from "@/app/context/CartContext"
import OrderSummary from "./OrderSummary"
import calculateTotal from "../../lib/calculateTotal"

export default function PaymentDetails() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [paymentIntentId, setPaymentIntentId] = useState(null)
    const [paymentDetails, setPaymentDetails] = useState(null)
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0)
    const [allowed, setAllowed] = useState(false)
    const { clearCart } = useCart()
    const queryIntent = searchParams.get("payment_intent")

    useEffect(() => {
        const intentFromURL = queryIntent
        const intentFromSession = sessionStorage.getItem("payment_intent")
        const paid = sessionStorage.getItem("payment_success")

        const intent = intentFromURL || intentFromSession

        if (intent) {
            // Allow page to render
            setPaymentIntentId(intent)
            setAllowed(true)

            // Clean up sessionStorage, but do it **after** rendering begins
            setTimeout(() => {
            sessionStorage.removeItem("payment_success")
            sessionStorage.removeItem("payment_intent")
            }, 500)

            // Clear guest cart
            const alreadyCleared = localStorage.getItem("cartCleared")
            if (!alreadyCleared) {
            clearCart()
            localStorage.setItem("cartCleared", "true")
            setTimeout(() => localStorage.removeItem("cartCleared"), 1000)
            }
        } else {
            // No valid intent, redirect to homepage
            router.replace("/")
        }
        }, [])


    useEffect(() => {
        const getProducts = async () => {
          const res = await fetch("/api/products");
          const data = await res.json();
          setProducts(data);
        };
        getProducts();
      }, []);

    useEffect(() => {
        if (paymentIntentId && products.length > 0) {
            fetch(`/api/payment?payment_intent=${paymentIntentId}`)
                .then(res => res.json())
                .then(data => {
                    setPaymentDetails(data)
                    setTotal(calculateTotal(data.items, products))
                })
                .catch(err => console.error(err))
        }
    }, [paymentIntentId, products])

    return (<>
        {allowed && (<div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
            <p className="mb-6">Thank you for your purchase!</p>
            {paymentDetails ? (<OrderSummary
                cartItems={paymentDetails.items}
                products={products}
                total={total}
            />) : <p>Loading your payment details...</p>}
        </div>)}
    </>)
}