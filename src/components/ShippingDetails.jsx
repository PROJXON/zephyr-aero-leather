import ShippingFormInput from "./ShippingFormInput"

export default function ShippingDetails({ details }) {
  return (<div className="w-full max-w-md">
    <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
    <div className="grid gap-1">
      <ShippingFormInput name="firstName" placeholder="First Name" value={details.name.first} />
      <ShippingFormInput name="lastName" placeholder="Last Name" value={details.name.last} />
      <ShippingFormInput name="address" placeholder="Address" value={details.address} />
      <ShippingFormInput name="city" placeholder="City" value={details.city} />
      <ShippingFormInput name="postalCode" placeholder="Postal Code" value={details.postalCode} />
      <ShippingFormInput name="country" placeholder="Country" value={details.country} />
    </div>
  </div>)
}