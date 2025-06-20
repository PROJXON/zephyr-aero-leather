"use client";
import { useCart } from "@/app/context/CartContext";
import { useState, useEffect, useReducer, useCallback, createContext, useRef, useMemo } from "react";
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
  AddressFormChange,
  State
} from "../../types/types";
import { useAddressValidation } from "../hooks/useAddressValidation";
import LoadingSpinner from "./LoadingSpinner";
import type { Appearance, StripeElementsOptions } from "@stripe/stripe-js";
import ShippingRateSelector from "./ShippingRateSelector";
import { calculateTotalWithTaxAndShipping } from "../../lib/calculateTotalWithTaxAndShipping";

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
  state: "" as State
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
      return { ...details, state: action.value as State };
    case "ALL": return { ...action.value };
    case "RESET": return { ...defaultAddressDetails };
    default: return details;
  }
}

export const ChangeContext = createContext<((event: AddressFormChange) => void)>(() => { });
export const StatesContext = createContext<readonly State[]>([]);

export default function Checkout({ products }: CheckoutProps) {
  const { cartItems, updateQuantity, orderId, isLoading } = useCart();
  const { validateAddress, isValidating, validationResult } = useAddressValidation();
  const lastValidatedAddress = useRef<string>('');
  const [editID, setEditID] = useState<number | null>(null);
  const [newQty, setNewQty] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isLoadingPaymentForm, setIsLoadingPaymentForm] = useState<boolean>(false);
  const [fetchedTaxAmount, setFetchedTaxAmount] = useState<number | undefined>(undefined);
  const [isUpdatingQuantities, setIsUpdatingQuantities] = useState<boolean>(false);
  const [billToShipping, setBillToShipping] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [shippingErrors, setShippingErrors] = useState<AddressErrors>({});
  const [shippingDetails, shippingDispatch] = useReducer(reducer, defaultAddressDetails)
  const [billingErrors, setBillingErrors] = useState<AddressErrors>({});
  const [billingDetails, billingDispatch] = useReducer(reducer, defaultAddressDetails)
  const [selectedShippingRateId, setSelectedShippingRateId] = useState<string | undefined>(undefined);

  const [shouldUpdatePayment, setShouldUpdatePayment] = useState(false);

  const states: readonly State[] = useMemo(() => [
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

  const handleShippingChange = useCallback((event: AddressFormChange) => {
    const name = event.target.name;
    const value = event.target.value;
    let type: AddressDetailsAction["type"];
    
    switch (name) {
      case "firstName": type = "FIRSTNAME"; break;
      case "lastName": type = "LASTNAME"; break;
      case "address1": type = "ADDRESS1"; break;
      case "address2": type = "ADDRESS2"; break;
      case "city": type = "CITY"; break;
      case "zipCode": type = "ZIPCODE"; break;
      case "state": type = "STATE"; break;
      default: return;
    }

    shippingDispatch({ type, value });

    // Trigger payment update when ZIP code or state changes (affects shipping rates and tax)
    if (name === "zipCode" || name === "state") {
      setShouldUpdatePayment(true);
      setFetchedTaxAmount(undefined); // Clear cached tax amount when address changes
    }
  }, []);

  // Handle shipping rate selection
  const handleShippingRateSelect = useCallback((rateId: string) => {
    setSelectedShippingRateId(rateId);
    setShouldUpdatePayment(true);
  }, []);

  // Update payment when necessary
  useEffect(() => {
    const newTotal = calculateTotal(cartItems, products);
    
    // Check if all required fields are filled
    const hasRequiredFields = 
      shippingDetails.name.first.trim() &&
      shippingDetails.name.last.trim() &&
      shippingDetails.address.line1.trim() &&
      shippingDetails.city.trim() &&
      shippingDetails.state &&
      shippingDetails.zipCode.trim().length >= 5;

    // Only update payment if we have a valid total, all required fields, and a reason to update
    if (newTotal > 50 && hasRequiredFields && shouldUpdatePayment) {
      setIsLoadingPaymentForm(true);
      
      // Debounce the payment update to prevent rapid-fire API calls
      const timeout = setTimeout(async () => {
        try {
          // Calculate shipping amounts from the calculation object
          const calculation = calculateTotalWithTaxAndShipping(
            cartItems,
            products,
            shippingDetails.state,
            shippingDetails.zipCode,
            selectedShippingRateId
          );

          // Fetch accurate tax from WooCommerce
          let accurateTax: number | undefined;
          try {
            const taxResponse = await fetch("/api/tax-estimate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                items: cartItems,
                state: shippingDetails.state,
                zipCode: shippingDetails.zipCode,
                shippingAmount: calculation.shipping // Pass shipping amount for tax calculation
              }),
            });

            if (taxResponse.ok) {
              const taxData = await taxResponse.json();
              accurateTax = taxData.taxAmount;
              setFetchedTaxAmount(taxData.taxAmount); // Store the fetched tax amount
            } else {
              throw new Error("Tax calculation failed");
            }
          } catch (error) {
            console.error("Tax estimate error:", error);
            // Don't proceed with payment if we can't get accurate tax
            throw new Error("Unable to calculate tax. Please try again.");
          }

          const response = await fetch("/api/payment", {
            method: paymentIntentId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: newTotal,
              currency: 'usd',
              items: cartItems,
              woo_order_id: orderId,
              payment_intent_id: paymentIntentId,
              shipping: shippingDetails,
              billing: billingDetails,
              selectedShippingRateId: selectedShippingRateId,
              shippingAmount: calculation.shipping,
              taxAmount: accurateTax
            }),
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Payment request failed');
          }

          const data = await response.json();
          setClientSecret(data.clientSecret);
          if (data.payment_intent_id) {
            setPaymentIntentId(data.payment_intent_id);
          }
          setShouldUpdatePayment(false);
          setIsLoadingPaymentForm(false);
        } catch (error) {
          console.error('Payment error:', error);
          setFormError(error instanceof Error ? error.message : 'Payment request failed');
          setIsLoadingPaymentForm(false);
        }
      }, 1500); // Increased debounce time to 1.5 seconds

      return () => clearTimeout(timeout);
    } else {
      setIsLoadingPaymentForm(false);
    }
  }, [
    cartItems,
    products,
    shouldUpdatePayment,
    orderId,
    paymentIntentId,
    shippingDetails,
    billingDetails,
    selectedShippingRateId
  ]);

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

  const toggleBillToShipping = () => setBillToShipping(!billToShipping);

  // Calculate totals with shipping and tax
  const calculation = calculateTotalWithTaxAndShipping(
    cartItems,
    products,
    shippingDetails.state,
    shippingDetails.zipCode,
    selectedShippingRateId
  );

  // Show loading state for tax if we're fetching accurate amounts
  const displayCalculation = {
    ...calculation,
    tax: fetchedTaxAmount,
    total: calculation.subtotal + calculation.shipping + (fetchedTaxAmount || 0)
  };

  // Custom updateQuantity function that triggers tax recalculation
  const handleQuantityUpdate = useCallback(async (productId: number, newQuantity: number) => {
    setIsUpdatingQuantities(true);
    setFetchedTaxAmount(undefined); // Clear cached tax amount
    
    // Update the quantity
    await updateQuantity(productId, newQuantity);
    
    // Trigger payment update to recalculate tax
    setShouldUpdatePayment(true);
    
    setIsUpdatingQuantities(false);
  }, [updateQuantity]);

  // Trigger tax recalculation when cart items change
  useEffect(() => {
    if (cartItems.length > 0 && shippingDetails.state && shippingDetails.zipCode) {
      setFetchedTaxAmount(undefined); // Clear cached tax amount
      setShouldUpdatePayment(true); // Trigger payment update to recalculate tax
    }
  }, [cartItems, shippingDetails.state, shippingDetails.zipCode]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner message="Loading cart..." />
      ) : cartItems?.length > 0 ? (
        <div className="flex flex-col gap-8">
          <OrderSummary
            cartItems={cartItems}
            products={products}
            subtotal={displayCalculation.subtotal}
            shipping={displayCalculation.shipping}
            tax={displayCalculation.tax}
            total={displayCalculation.total}
            isLoadingTax={fetchedTaxAmount === undefined && (isLoadingPaymentForm || isUpdatingQuantities)}
            quantityControls={{
              updateQuantity: handleQuantityUpdate,
              editID,
              setEditID,
              newQty,
              setNewQty,
              changeQuantity,
            }}
          />
          <div className="flex flex-wrap lg:flex-nowrap gap-8 max-w-7xl w-full mx-auto">
            <div className="w-full lg:w-1/2">
              <StatesContext.Provider value={states}>
                <ChangeContext.Provider value={handleShippingChange}>
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
                {/* Shipping Rate Selector Integration */}
                <div className="mt-4">
                  <ShippingRateSelector
                    state={shippingDetails.state}
                    zipCode={shippingDetails.zipCode}
                    cartItems={cartItems}
                    products={products}
                    selectedRateId={selectedShippingRateId}
                    onRateSelect={handleShippingRateSelect}
                  />
                </div>
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
                {!billToShipping && (
                  <ChangeContext.Provider value={handleShippingChange}>
                    <AddressDetails title="Billing Information" details={billingDetails} errors={billingErrors} />
                  </ChangeContext.Provider>
                )}
              </StatesContext.Provider>
            </div>
            <div className="w-full lg:w-1/2">
              {clientSecret ? (
                <Elements stripe={stripePromise} options={options}>
                  <StripeForm
                    clientSecret={clientSecret}
                    formError={formError}
                    setFormError={setFormError}
                    validateShipping={() => validateAddressForm(shippingDetails)}
                    setShippingErrors={setShippingErrors}
                    validateBilling={() => validateAddressForm(billingDetails)}
                    setBillingErrors={setBillingErrors}
                    isUpdatingShipping={isLoadingPaymentForm || isUpdatingQuantities}
                  />
                </Elements>
              ) : isLoadingPaymentForm || isUpdatingQuantities ? (
                <LoadingSpinner message={isUpdatingQuantities ? "Updating order..." : "Loading payment form..."} />
              ) : (
                <div className="w-full border border-gray-300 rounded-md p-4 bg-white shadow-sm mt-11">
                  <div className="text-center">
                    <p className="text-gray-500">Please enter your shipping information to proceed with payment</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p>Your cart is empty</p>
      )}
    </>
  );
}