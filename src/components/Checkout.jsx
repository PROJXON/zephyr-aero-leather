"use client"
import { useCart } from "@/app/context/CartContext"
import { useState, useEffect } from "react"
import { FaEdit } from "react-icons/fa"
import getChangeQuantity from "../../lib/getChangeQuantity"
import calculateTotal from "../../lib/calculateTotal"
import OrderSummary from "./OrderSummary"
import StripeForm from "./StripeForm"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export default function Checkout({ products }) {
    const { cartItems, updateQuantity, clearCart } = useCart();

    const getItemInfo = item => {
        const itemInfo = products.filter(product => product.id === item.id)[0]
        const priceInCents = itemInfo.price * 100 * item.quantity

        return [itemInfo, priceInCents]
    }

    const calculateTotal = () => {
        let initialTotal = 0

        cartItems.map(item => {
            const priceInCents = getItemInfo(item)[1]
            initialTotal += priceInCents
        })

        return initialTotal
    }

    const formatPrice = priceInCents => {
        const dollars = Math.floor(priceInCents / 100)
        const cents = priceInCents % 100
        return `$${dollars}.${cents.toString().padStart(2, '0')}`
    }

    let changeQuantity = getChangeQuantity({ updateQuantity })
    changeQuantity.push({
        icon: FaEdit,
        onClick: (item) => {
            setEditID(item.id);
            setNewQty(item.quantity.toString());
        }
    });

    const handleClearCart = async () => {
        try {
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: cartItems }) // or however your API expects this
          });
      
          if (!response.ok) throw new Error("Order submission failed");
      
          const result = await response.json();
      
          if (result.success) {
            clearCart();
          } else {
            console.error("Order was not successful:", result.message);
          }
        } catch (err) {
          console.error("Order error:", err.message);
        }
      };

    const [total, setTotal] = useState(calculateTotal)
    const [editID, setEditID] = useState(null)
    const [newQty, setNewQty] = useState('')
    const [clientSecret, setClientSecret] = useState('')
    const [paymentIntentId, setPaymentIntentId] = useState(null)

    useEffect(() => {
        const newTotal = calculateTotal(cartItems, products)
        setTotal(newTotal)

        if (newTotal > 50) {
            const timeout = setTimeout(() => {
                fetch('/api/payment', {
                    method: paymentIntentId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: newTotal,
                        items: cartItems,
                        payment_intent_id: paymentIntentId
                    })
                }).then(res => res.json())
                    .then(data => {
                        setClientSecret(data.clientSecret)
                        if (data.paymentIntentId) setPaymentIntentId(data.paymentIntentId)
                    })
            }, 500)

            return () => clearTimeout(timeout)
        }
    }, [cartItems])

    const appearance = { theme: 'stripe' };
    const options = { clientSecret, appearance }

    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

    return (<>
        {cartItems?.length > 0 ? <div className="grid grid-cols-[60%_40%] gap-2">
            {clientSecret && (<Elements stripe={stripePromise} options={options}>
                <StripeForm />
            </Elements>)}
            <OrderSummary
                cartItems={cartItems}
                products={products}
                total={total}
                editable={true}
                updateQuantity={updateQuantity}
                editID={editID}
                setEditID={setEditID}
                newQty={newQty}
                setNewQty={setNewQty}
                changeQuantity={changeQuantity}
            />
        </div> : <p>Your cart is empty</p>}
    </>)
}