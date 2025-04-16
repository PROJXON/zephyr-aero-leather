"use client"
import { useCart } from "@/app/context/CartContext"
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa"
import getChangeQuantity from "../../lib/getChangeQuantity"
import calculateTotal from "../../lib/calculateTotal"
import OrderSummary from "./OrderSummary"
import StripeForm from "./StripeForm"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

export default function Checkout({ products }) {
    const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart()

    let changeQuantity = getChangeQuantity({ addToCart, removeFromCart, updateQuantity })
    changeQuantity.push({
        icon: FaEdit,
        onClick: item => {
            setEditID(item.id)
            setNewQty(item.quantity.toString())
        }
    })

    const [total, setTotal] = useState(calculateTotal(cartItems, products))
    const [editID, setEditID] = useState(null)
    const [newQty, setNewQty] = useState('')

    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        //Note: Pressing the + button doesn't cause the quantities to be updated on the payment-success page. It may be due to how slow the + button is now.
        setTotal(calculateTotal(cartItems, products))

        if (total > 50) {
            fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    items: cartItems
                })
            }).then(res => res.json())
                .then(data => setClientSecret(data.clientSecret))
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
                removeFromCart={removeFromCart}
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