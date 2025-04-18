"use client"

import { useEffect } from "react"
import { useCart } from "@/app/context/CartContext"
import fetchProducts from "../../../lib/woocommerce"
import PaymentDetails from "@/components/PaymentDetails"

export default async function PaymentSuccess() {
    const products = await fetchProducts()

    const { clearCart } = useCart()

    useEffect(() => {
      const alreadyCleared = localStorage.getItem("cartCleared")
  
      if (!alreadyCleared) {
        clearCart()
        localStorage.setItem("cartCleared", "true")
      }
    }, [])
  

    return (<div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Payment Successful! 🎉</h1>
        <p>Thank you for your purchase.</p>
        <PaymentDetails products={products} />
    </div>)
}