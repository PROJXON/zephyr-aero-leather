"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect, useReducer, createContext } from "react";
import { FaEdit } from "react-icons/fa";
import getChangeQuantity from "../../lib/getChangeQuantity";
import calculateTotal from "../../lib/calculateTotal";
import OrderSummary from "./OrderSummary";
import ShippingDetails from "./ShippingDetails";
import StripeForm from "./StripeForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutProps, ShippingDetailsState, ShippingDetailsAction, ShippingErrors } from "../../types/types";
import type { StripeElementsOptions, Appearance } from "@stripe/stripe-js";

function reducer(details: ShippingDetailsState, action: ShippingDetailsAction): ShippingDetailsState {
  switch (action.type) {
    case "FIRSTNAME":
      return {
        ...details,
        name: { ...details.name, first: action.value },
      };
    case "LASTNAME":
      return {
        ...details,
        name: { ...details.name, last: action.value },
      };
    case "ADDRESS1":
      return {
        ...details,
        address: { ...details.address, line1: action.value },
      };
    case "ADDRESS2":
      return {
        ...details,
        address: { ...details.address, line2: action.value },
      };
    case "CITY":
      return { ...details, city: action.value };
    case "ZIPCODE":
      return { ...details, zipCode: action.value };
    case "STATE":
      return { ...details, state: action.value };
    default:
      return details;
  }
}

export const ChangeContext = createContext<((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void) | undefined>(undefined);

export default function Checkout({ products }: CheckoutProps) {
  const { cartItems, updateQuantity, orderId } = useCart();
  const [total, setTotal] = useState<number>(calculateTotal(cartItems, products));
  const [editID, setEditID] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [shippingErrors, setShippingErrors] = useState<ShippingErrors>({});
  const [shippingDetails, dispatch] = useReducer(reducer, {
    name: { first: "", last: "" },
    address: { line1: "", line2: "" },
    city: "",
    zipCode: "",
    state: "",
  });

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

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
            shipping: shippingDetails,
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
  }, [cartItems, shippingDetails, orderId, paymentIntentId, products]);

  const appearance: Appearance = { theme: "stripe" };
  const options: StripeElementsOptions = { clientSecret, appearance };
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  const validateShipping = (): ShippingErrors => {
    const errors: ShippingErrors = {};

    if (!shippingDetails.name.first.trim()) errors.firstName = "Enter your first name";
    if (!shippingDetails.name.last.trim()) errors.lastName = "Enter your last name";
    if (!shippingDetails.address.line1.trim()) errors.address = "Enter your address";
    if (!shippingDetails.city.trim()) errors.city = "Enter your city";
    if (!/^\d{5}$/.test(shippingDetails.zipCode.trim())) errors.zipCode = "Enter a valid ZIP code";
    const statesSet = new Set(states);
    if (!statesSet.has(shippingDetails.state)) errors.state = "Select a valid state";

    return errors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    dispatch({
      type: name.toUpperCase(),
      value: value,
    });

    setShippingErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "address1") delete newErrors["address"];
      else delete newErrors[name];
      return newErrors;
    });
  };

  return (
    <>
      {cartItems?.length > 0 ? (
        <div className="flex flex-col gap-8">
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
              changeQuantity, // this is an array from getChangeQuantity
            }}
          />
          {clientSecret && (
            <div className="flex flex-wrap lg:flex-nowrap gap-2 place-content-between max-w-7xl w-full mx-auto">
              <ChangeContext.Provider value={handleChange}>
                <ShippingDetails details={shippingDetails} errors={shippingErrors} states={states} />
              </ChangeContext.Provider>
              <div className="w-full lg:max-w-md">
                <Elements stripe={stripePromise} options={options}>
                  <StripeForm
                    clientSecret={clientSecret}
                    formError={formError}
                    setFormError={setFormError}
                    validateShipping={validateShipping}
                    setShippingErrors={setShippingErrors}
                  />
                </Elements>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </>
  );
}