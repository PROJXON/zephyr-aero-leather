"use client"
import { useReducer, createContext } from "react"
import ShippingFormInput from "./ShippingFormInput"

const reducer = (details, action) => {
  switch (action.type) {
    case "NAME":
      return { ...details, name: action.value }
    case "ADDRESS":
      return { ...details, address: action.value }
    case "CITY":
      return { ...details, city: action.value }
    case "POSTALCODE":
      return { ...details, postalCode: action.value }
    case "COUNTRY":
      return { ...details, country: action.value }
    default:
      return details
  }
}

export const ChangeContext = createContext()

export default function ShippingDetails() {
  const [details, dispatch] = useReducer(reducer, {
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: ""
  })

  const handleChange = e => {
    dispatch({
      type: e.target.name.toUpperCase(),
      value: e.target.value
    })
  }

  return (<div className="w-full max-w-md">
    <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
    <ChangeContext.Provider value={handleChange}>
      <ShippingFormInput name="name" placeholder="Full Name" value={details.name} />
      <ShippingFormInput name="address" placeholder="Address" value={details.address} />
      <ShippingFormInput name="city" placeholder="City" value={details.city} />
      <ShippingFormInput name="postalCode" placeholder="Postal Code" value={details.postalCode} />
      <ShippingFormInput name="country" placeholder="Country" value={details.country} />
    </ChangeContext.Provider>
  </div>)
}