"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import getChangeQuantity from "../../lib/getChangeQuantity";
import calculateTotal from "../../lib/calculateTotal";
import OrderSummary from "./OrderSummary";
import ShippingDetails from "./ShippingDetails"
import StripeForm from "./StripeForm"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function Checkout({ products }) {
  const { cartItems, updateQuantity, orderId } = useCart();

  const [total, setTotal] = useState(calculateTotal(cartItems, products));
  const [editID, setEditID] = useState(null);
  const [newQty, setNewQty] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState(null);

  const changeQuantity = getChangeQuantity({ updateQuantity });
  changeQuantity.push({
    icon: FaEdit,
    onClick: (item) => {
      setEditID(item.id);
      setNewQty(item.quantity.toString());
    },
  });

  useEffect(() => {
    const newTotal = calculateTotal(cartItems, products);
    setTotal(newTotal);

    if (newTotal > 50) {
      const timeout = setTimeout(() => {
        fetch("/api/payment", {
          method: paymentIntentId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: newTotal,
            items: cartItems,
            woo_order_id: orderId,
            payment_intent_id: paymentIntentId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setClientSecret(data.clientSecret);
            if (data.payment_intent_id) {
              setPaymentIntentId(data.payment_intent_id);
            }
          });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [cartItems]);

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (<>
    {cartItems?.length > 0 ? (<div className="flex flex-col gap-8">
      <OrderSummary
        cartItems={cartItems}
        products={products}
        total={total}
        quantityControls={{
          updateQuantity,
          editID,
          setEditID,
          newQty,
          setNewQty,
          changeQuantity,
        }}
      />
      {clientSecret && (
        <div className="flex place-content-between">
          <ShippingDetails />
          <div className="w-full max-w-md">
            <Elements stripe={stripePromise} options={options}>
              <StripeForm paymentIntentId={paymentIntentId} />
            </Elements>
          </div>
        </div>
      )}
    </div>) : <p>Your cart is empty</p>}
  </>)
}
