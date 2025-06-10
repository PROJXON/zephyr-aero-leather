import ShippingFormInput from "./ShippingFormInput"

export default function ShippingDetails({ details }) {
  const { name, address, city, postalCode, country } = details

  return (<div className="w-full max-w-md">
    <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
    <div className="grid gap-1">
      <ShippingFormInput name="firstName" placeholder="First Name" value={name.first} />
      <ShippingFormInput name="lastName" placeholder="Last Name" value={name.last} />
      <ShippingFormInput name="address" placeholder="Address" value={address} />
      <ShippingFormInput name="city" placeholder="City" value={city} />
      <ShippingFormInput name="postalCode" placeholder="Postal Code" value={postalCode} />
      <ShippingFormInput name="country" placeholder="Country" value={country} />
    </div>
  </div>)
}