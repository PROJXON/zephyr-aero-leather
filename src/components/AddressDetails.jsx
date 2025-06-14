import AddressFormInput from "./AddressFormInput"

export default function AddressDetails({ details, errors, states }) {
  const { name, address, city, zipCode, state } = details

  return (<div className="w-full lg:max-w-xl">
    <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
    <div className="grid grid-cols-6 gap-1">
      <AddressFormInput
        name="firstName" placeholder="First Name" value={name.first} span={3} error={errors.firstName}
      />
      <AddressFormInput
        name="lastName" placeholder="Last Name" value={name.last} span={3} error={errors.lastName}
      />
      <AddressFormInput
        name="address1" placeholder="Address (line 1)" value={address.line1} span={3} error={errors.address}
      />
      <AddressFormInput
        name="address2" placeholder="Address (line 2, optional)" value={address.line2} span={3}
      />
      <AddressFormInput name="city" placeholder="City" value={city} span={2} error={errors.city} />
      <AddressFormInput
        name="zipCode" placeholder="Zip Code" value={zipCode} span={2} error={errors.zipCode} type="number"
      />
      <AddressFormInput
        name="state"
        placeholder="State"
        value={state}
        span={2}
        error={errors.state}
        type="select"
        options={states}
      />
    </div>
  </div>)
}