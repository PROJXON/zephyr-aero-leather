import ShippingFormInput from "./ShippingFormInput"

export default function ShippingDetails({ details }) {
  const { name, address, city, zipCode, state } = details
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"]

  return (<div className="w-full lg:max-w-xl">
    <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
    <div className="grid grid-cols-6 gap-1">
      <ShippingFormInput name="firstName" placeholder="First Name" value={name.first} span={3} />
      <ShippingFormInput name="lastName" placeholder="Last Name" value={name.last} span={3} />
      <ShippingFormInput name="address1" placeholder="Address (line 1)" value={address.line1} span={3} />
      <ShippingFormInput name="address2" placeholder="Address (line 2, optional)" value={address.line2} span={3} />
      <ShippingFormInput name="city" placeholder="City" value={city} span={2} />
      <ShippingFormInput name="zipCode" placeholder="Zip Code" value={zipCode} span={2} type="number" />
      <ShippingFormInput name="state" placeholder="State" value={state} span={2} type="select" options={states} />
    </div>
  </div>)
}