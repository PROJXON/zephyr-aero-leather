"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect, useReducer, createContext } from "react";
import { FaEdit } from "react-icons/fa";
import getChangeQuantity from "../../lib/getChangeQuantity";
import calculateTotal from "../../lib/calculateTotal";
import OrderSummary from "./OrderSummary";
import AddressDetails from "./AddressDetails"
import StripeForm from "./StripeForm"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"

const reducer = (details, action) => {
  switch (action.type) {
    case "FIRSTNAME":
      return {
        ...details,
        name: { ...details.name, first: action.value }
      }
    case "LASTNAME":
      return {
        ...details,
        name: { ...details.name, last: action.value }
      }
    case "ADDRESS1":
      return {
        ...details,
        address: { ...details.address, line1: action.value }
      }
    case "ADDRESS2":
      return {
        ...details,
        address: { ...details.address, line2: action.value }
      }
    case "CITY":
      return { ...details, city: action.value }
    case "ZIPCODE":
      return { ...details, zipCode: action.value }
    case "STATE":
      return { ...details, state: action.value }
    default:
      return details
  }
}

const defaultAddressDetails = {
  name: {
    first: "",
    last: ""
  },
  address: {
    line1: "",
    line2: ""
  },
  city: "",
  zipCode: "",
  state: ""
}

export const ChangeContext = createContext()
export const StatesContext = createContext()

export default function Checkout({ products }) {
  const { cartItems, updateQuantity, orderId } = useCart();
  const [total, setTotal] = useState(calculateTotal(cartItems, products));
  const [editID, setEditID] = useState(null);
  const [newQty, setNewQty] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState(null)
  const [formError, setFormError] = useState(null)
  const [shippingErrors, setShippingErrors] = useState({})
  const [shippingDetails, shippingDispatch] = useReducer(reducer, defaultAddressDetails)
  const [billingErrors, setBillingErrors] = useState({})
  const [billingDetails, billingDispatch] = useReducer(reducer, defaultAddressDetails)

  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

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
            shipping: shippingDetails
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
  }, [cartItems, shippingDetails])

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

  const validateAddress = details => {
    const errors = {}

    if (!details.name.first.trim()) errors.firstName = "Enter your first name"
    if (!details.name.last.trim()) errors.lastName = "Enter your last name"
    if (!details.address.line1.trim()) errors.address = "Enter your address"
    if (!details.city.trim()) errors.city = "Enter your city"
    if (!/^\d{5}$/.test(details.zipCode.trim())) errors.zipCode = "Enter a valid ZIP code"
    const statesSet = new Set(states)
    if (!statesSet.has(details.state)) errors.state = "Select a valid state"

    return errors
  }

  const handleChange = (dispatch, setErrors) => e => {
    const { name, value } = e.target

    dispatch({
      type: name.toUpperCase(),
      value: value
    })

    setErrors(prev => {
      const newErrors = { ...prev }
      if (name === "address1") delete newErrors["address"]
      else delete newErrors[name]
      return newErrors
    })
  }

  const shippingChange = handleChange(shippingDispatch, setShippingErrors)
  const billingChange = handleChange(billingDispatch, setBillingErrors)

  return (<>
    {cartItems?.length > 0 ? (<div className="flex flex-col gap-8">
      <OrderSummary cartItems={cartItems} products={products} total={total} quantityControls={{
        updateQuantity,
        editID,
        setEditID,
        newQty,
        setNewQty,
        changeQuantity,
      }} />
      {clientSecret && (<div
        className="flex flex-wrap lg:flex-nowrap gap-2 place-content-between max-w-7xl w-full mx-auto"
      >
        <div className="w-full lg:max-w-xl">
          <StatesContext.Provider value={states}>
            <ChangeContext.Provider value={billingChange}>
              <AddressDetails title="Billing Information" details={billingDetails} errors={billingErrors} />
            </ChangeContext.Provider>
            <br />
            <ChangeContext.Provider value={shippingChange}>
              <AddressDetails title="Shipping Information" details={shippingDetails} errors={shippingErrors} />
            </ChangeContext.Provider>
          </StatesContext.Provider>
        </div>
        <div className="w-full lg:max-w-md">
          <Elements stripe={stripePromise} options={options}>
            <StripeForm
              clientSecret={clientSecret}
              formError={formError}
              setFormError={setFormError}
              validateBilling={() => validateAddress(billingDetails)}
              setBillingErrors={setBillingErrors}
              validateShipping={() => validateAddress(shippingDetails)}
              setShippingErrors={setShippingErrors}
            />
          </Elements>
        </div>
      </div>)}
    </div>) : <p>Your cart is empty</p>}
  </>)
}