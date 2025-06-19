"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect, useReducer, useCallback, createContext, Dispatch, SetStateAction, useRef, useMemo } from "react";
import { FaEdit } from "react-icons/fa";
import getChangeQuantity from "../../lib/getChangeQuantity";
import calculateTotal from "../../lib/calculateTotal";
import OrderSummary from "./OrderSummary";
import AddressDetails from "./AddressDetails";
import StripeForm from "./StripeForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import type {
  CheckoutProps,
  AddressDetailsState,
  AddressDetailsAction,
  AddressErrors,
  AddressFormChange
} from "../../types/types";
import { useAddressValidation } from "../hooks/useAddressValidation";
import LoadingSpinner from "./LoadingSpinner";
import type { Appearance, StripeElementsOptions } from "@stripe/stripe-js";

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

export const ChangeContext = createContext<((event: AddressFormChange) => void)>(() => { });
export const StatesContext = createContext<readonly string[]>([]);

export default function Checkout({ products }: CheckoutProps) {
  const { cartItems, updateQuantity, orderId, isLoading } = useCart();
  const { validateAddress, isValidating, validationResult } = useAddressValidation();
  const lastValidatedAddress = useRef<string>('');
  const [total, setTotal] = useState<number>(calculateTotal(cartItems, products));
  const [editID, setEditID] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoadingPaymentForm, setIsLoadingPaymentForm] = useState<boolean>(false);
  const [billToShipping, setBillToShipping] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [shippingErrors, setShippingErrors] = useState<AddressErrors>({});
  const [shippingDetails, shippingDispatch] = useReducer(reducer, defaultAddressDetails)
  const [billingErrors, setBillingErrors] = useState<AddressErrors>({});
  const [billingDetails, billingDispatch] = useReducer(reducer, defaultAddressDetails)

  const states: readonly string[] = useMemo(() => [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ] as const, []);

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
      setIsLoadingPaymentForm(true);
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
            setIsLoadingPaymentForm(false);
          })
          .catch((error) => {
            console.error('Payment error:', error);
            setFormError(error.message);
            setIsLoadingPaymentForm(false);
          });
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      setIsLoadingPaymentForm(false);
    }
  }, [cartItems, shippingDetails, billingDetails, orderId, paymentIntentId, products]);

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

  const validateAddressForm = useCallback((details: AddressDetailsState): AddressErrors => {
    const errors: AddressErrors = {};

    // Required fields
    if (!details.name.first.trim()) errors.firstName = "First name is required";
    if (!details.name.last.trim()) errors.lastName = "Last name is required";
    if (!details.address.line1.trim()) errors.address = "Address is required";
    if (!details.city.trim()) errors.city = "City is required";
    
    // ZIP code validation for 5-digit or 9-digit format (XXXXX-XXXX)
    const zipCode = details.zipCode.trim();
    if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
      errors.zipCode = "Enter a valid ZIP code (5 or 9 digits)";
    }
    
    const statesSet = new Set(states);
    if (!statesSet.has(details.state)) errors.state = "Please select a state";

    // Address line 2 is optional, no validation needed

    return errors;
  }, [states]);

  // Auto-validate address when all required fields are filled
  useEffect(() => {
    const errors = validateAddressForm(shippingDetails);
    const hasAllRequiredFields = !errors.firstName && !errors.lastName && !errors.address && !errors.city && !errors.zipCode && !errors.state;
    
    // Only validate if all required fields are complete AND we have a meaningful address
    if (hasAllRequiredFields && 
        shippingDetails.address.line1.trim().length > 5 && 
        shippingDetails.city.trim().length > 2 &&
        shippingDetails.zipCode.trim().length >= 5) {
      
      // Debounce validation to avoid too many API calls
      const timeout = setTimeout(() => {
        // Double-check that we haven't already validated this exact address
        const currentAddress = JSON.stringify(shippingDetails);
        if (currentAddress !== lastValidatedAddress.current) {
          lastValidatedAddress.current = currentAddress;
          validateAddress(shippingDetails);
        }
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [shippingDetails, validateAddress, validateAddressForm]);

  // Update shipping details with validated address if available
  useEffect(() => {
    if (validationResult?.valid && validationResult.validatedAddress) {
      shippingDispatch({ type: "ALL", value: validationResult.validatedAddress });
    }
  }, [validationResult]);

  const handleChange = (
    dispatch: Dispatch<AddressDetailsAction>,
    setErrors: Dispatch<SetStateAction<AddressErrors>>) => (event: AddressFormChange
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
    (event: AddressFormChange) => handleChange(shippingDispatch, setShippingErrors)(event),
    [shippingDispatch, setShippingErrors]
  );
  const billingChange = useCallback(
    (event: AddressFormChange) => handleChange(billingDispatch, setBillingErrors)(event),
    [billingDispatch, setBillingErrors]
  );

  const toggleBillToShipping = () => setBillToShipping(!billToShipping);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner message="Loading cart..." />
      ) : cartItems?.length > 0 ? (
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
            <div className="flex flex-wrap lg:flex-nowrap gap-8 max-w-7xl w-full mx-auto">
              <div className="w-full lg:w-1/2">
                <StatesContext.Provider value={states}>
                  <ChangeContext.Provider value={shippingChange}>
                    <AddressDetails title="Shipping Information" details={shippingDetails} errors={shippingErrors} />
                    {isValidating && (
                      <div className="mt-6 text-sm text-blue-600">
                        <LoadingSpinner message="Validating address..." size="sm" className="h-8" />
                      </div>
                    )}
                    {validationResult && !validationResult.valid && validationResult.error && (
                      <div className="mt-6 text-sm text-red-600">
                        ⚠️ {validationResult.error}
                      </div>
                    )}
                    {validationResult?.valid && (
                      <div className="mt-6 text-sm text-green-600">
                        ✅ Address validated successfully
                      </div>
                    )}
                    <div className="text-sm text-gray-500 mt-2 italic">
                      Invalid addresses will still work for test payments in development mode
                    </div>
                  </ChangeContext.Provider>
                  <div className="mt-4">
                    <input
                      type="checkbox"
                      name="billToShipping"
                      onChange={toggleBillToShipping}
                      checked={billToShipping}
                      className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-neutral-dark transition accent-neutral-dark"
                    />
                    <label htmlFor="billToShipping" onClick={toggleBillToShipping} className="ml-2 text-neutral-dark">
                      Bill to shipping address
                    </label>
                  </div>
                  {!billToShipping && (<ChangeContext.Provider value={billingChange}>
                    <AddressDetails title="Billing Information" details={billingDetails} errors={billingErrors} />
                  </ChangeContext.Provider>)}
                </StatesContext.Provider>
              </div>
              <div className="w-full lg:w-1/2">
                <Elements stripe={stripePromise} options={options}>
                  <StripeForm
                    clientSecret={clientSecret}
                    formError={formError}
                    setFormError={setFormError}
                    validateShipping={() => validateAddressForm(shippingDetails)}
                    setShippingErrors={setShippingErrors}
                    validateBilling={() => validateAddressForm(billingDetails)}
                    setBillingErrors={setBillingErrors}
                  />
                </Elements>
              </div>
            </div>
          )}
          {isLoadingPaymentForm && !clientSecret && (
            <div className="flex flex-wrap lg:flex-nowrap gap-8 max-w-7xl w-full mx-auto">
              <div className="w-full lg:w-1/2">
                <StatesContext.Provider value={states}>
                  <ChangeContext.Provider value={shippingChange}>
                    <AddressDetails title="Shipping Information" details={shippingDetails} errors={shippingErrors} />
                    {isValidating && (
                      <div className="mt-6 text-sm text-blue-600">
                        <LoadingSpinner message="Validating address..." size="sm" className="h-8" />
                      </div>
                    )}
                    {validationResult && !validationResult.valid && validationResult.error && (
                      <div className="mt-6 text-sm text-red-600">
                        ⚠️ {validationResult.error}
                      </div>
                    )}
                    {validationResult?.valid && (
                      <div className="mt-6 text-sm text-green-600">
                        ✅ Address validated successfully
                      </div>
                    )}
                  </ChangeContext.Provider>
                  <div className="mt-4">
                    <input
                      type="checkbox"
                      name="billToShipping"
                      onChange={toggleBillToShipping}
                      checked={billToShipping}
                      className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-neutral-dark transition accent-neutral-dark"
                    />
                    <label htmlFor="billToShipping" onClick={toggleBillToShipping} className="ml-2 text-neutral-dark">
                      Bill to shipping address
                    </label>
                  </div>
                  {!billToShipping && (<ChangeContext.Provider value={billingChange}>
                    <AddressDetails title="Billing Information" details={billingDetails} errors={billingErrors} />
                  </ChangeContext.Provider>)}
                </StatesContext.Provider>
              </div>
              <div className="w-full lg:w-1/2">
                <LoadingSpinner message="Loading payment form..." />
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