"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect, useReducer, useCallback, createContext } from "react";
import { FaEdit } from "react-icons/fa";
import getChangeQuantity from "../../lib/getChangeQuantity";
import calculateTotal from "../../lib/calculateTotal";
import OrderSummary from "./OrderSummary";
import AddressDetails from "./AddressDetails";
import StripeForm from "./StripeForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutProps, AddressDetailsState, AddressDetailsAction, AddressErrors } from "../../types/types";
import type { StripeElementsOptions, Appearance } from "@stripe/stripe-js";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
};

function reducer(details: AddressDetailsState, action: AddressDetailsAction): AddressDetailsState {
  switch (action.type) {
    case "FIRSTNAME":
      return { ...details, name: { ...details.name, first: action.value } };
    case "LASTNAME":
      return { ...details, name: { ...details.name, last: action.value } };
    case "ADDRESS1":
      return { ...details, address: { ...details.address, line1: action.value } };
    case "ADDRESS2":
      return { ...details, address: { ...details.address, line2: action.value } };
    case "CITY":
      return { ...details, city: action.value };
    case "ZIPCODE":
      return { ...details, zipCode: action.value };
    case "STATE":
      return { ...details, state: action.value };
    case "ALL": return { ...action.value };
    case "RESET": return { ...defaultAddressDetails };
    default: return details;
  }
}

export const ChangeContext = createContext<((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void)>(() => { });
export const StatesContext = createContext<(string[])>([]);

export default function Checkout({ products }: CheckoutProps) {
  const { cartItems, updateQuantity, orderId } = useCart();
  const [total, setTotal] = useState<number>(calculateTotal(cartItems, products));
  const [editID, setEditID] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [billToShipping, setBillToShipping] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [shippingErrors, setShippingErrors] = useState<AddressErrors>({});
  const [shippingDetails, shippingDispatch] = useReducer(reducer, defaultAddressDetails)
  const [billingErrors, setBillingErrors] = useState<AddressErrors>({});
  const [billingDetails, billingDispatch] = useReducer(reducer, defaultAddressDetails)

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
            currency: 'usd',
            items: cartItems,
            woo_order_id: orderId,
            payment_intent_id: paymentIntentId,
            shipping: shippingDetails,
            billing: billingDetails
          }),
        })
          .then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.error || 'Payment request failed');
            }
            return data;
          })
          .then((data) => {
            setClientSecret(data.clientSecret);
            if (data.payment_intent_id) {
              setPaymentIntentId(data.payment_intent_id);
            }
          })
          .catch((error) => {
            console.error('Payment error:', error);
            setFormError(error.message);
          });
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [cartItems, shippingDetails, billingDetails]);

  useEffect(() => {
    if (billToShipping) {
      billingDispatch({
        type: "ALL",
        value: shippingDetails
      });
    }
  }, [billToShipping, shippingDetails]);

  useEffect(() => {
    if (!billToShipping) billingDispatch({ type: "RESET" });
  }, [billToShipping]);

  const appearance: Appearance = { theme: "stripe" };
  const options: StripeElementsOptions = {
    clientSecret,
    appearance
  };

  const validateAddress = (details: AddressDetailsState): AddressErrors => {
    const errors: AddressErrors = {};

    if (!details.name.first.trim()) errors.firstName = "Enter your first name";
    if (!details.name.last.trim()) errors.lastName = "Enter your last name";
    if (!details.address.line1.trim()) errors.address = "Enter your address";
    if (!details.city.trim()) errors.city = "Enter your city";
    if (!/^\d{5}$/.test(details.zipCode.trim())) errors.zipCode = "Enter a valid ZIP code";
    const statesSet = new Set(states);
    if (!statesSet.has(details.state)) errors.state = "Select a valid state";

    return errors;
  };

  const handleChange = (
    dispatch: Dispatch<AddressDetailsAction>,
    setErrors: Dispatch<SetStateAction<AddressErrors>>) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = event.target;
      const type = name.toUpperCase() as AddressDetailsAction["type"];
      if (type === "ALL" || type === "RESET") return;

      dispatch({ type, value });
      setErrors((prev: AddressErrors) => {
        const newErrors = { ...prev };
        if (name === "address1") delete newErrors["address"];
        else delete newErrors[name as keyof AddressErrors];
        return newErrors;
      });
    };

  const shippingChange = useCallback(
    handleChange(shippingDispatch, setShippingErrors),
    [shippingDispatch, setShippingErrors]
  );
  const billingChange = useCallback(
    handleChange(billingDispatch, setBillingErrors),
    [billingDispatch, setBillingErrors]
  );

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
              <div className="w-full lg:max-w-xl grid gap-2">
                <StatesContext.Provider value={states}>
                  <ChangeContext.Provider value={shippingChange}>
                    <AddressDetails title="Shipping Information" details={shippingDetails} errors={shippingErrors} />
                  </ChangeContext.Provider>
                  <div>
                    <input
                      type="checkbox"
                      name="billToShipping"
                      onChange={() => setBillToShipping(!billToShipping)}
                      checked={billToShipping}
                    />
                    <label htmlFor="billToShipping" className="ml-2">Bill to shipping address</label>
                  </div>
                  {!billToShipping && (<ChangeContext.Provider value={billingChange}>
                    <AddressDetails title="Billing Information" details={billingDetails} errors={billingErrors} />
                  </ChangeContext.Provider>)}
                </StatesContext.Provider>
              </div>
              <div className="w-full lg:max-w-md">
                <Elements stripe={stripePromise} options={options}>
                  <StripeForm
                    clientSecret={clientSecret}
                    formError={formError}
                    setFormError={setFormError}
                    validateShipping={() => validateAddress(shippingDetails)}
                    setShippingErrors={setShippingErrors}
                    validateBilling={() => validateAddress(billingDetails)}
                    setBillingErrors={setBillingErrors}
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