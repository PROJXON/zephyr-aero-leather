import AddressFormInput from "./AddressFormInput";
import type { AddressDetailsState, AddressErrors, AddressFormInputProps } from "../../types/types";

export default function AddressDetails({ title, details, errors }: {
  title: string;
  details: AddressDetailsState;
  errors: AddressErrors;
}) {
  const { name, address, city, zipCode, state } = details;

  const inputs = [
    {
      name: "firstName",
      placeholder: "First Name",
      value: name.first,
      span: 3,
      error: errors.firstName
    },
    {
      name: "lastName",
      placeholder: "Last Name",
      value: name.last,
      span: 3,
      error: errors.lastName
    },
    {
      name: "address1",
      placeholder: "Address (line 1)",
      value: address.line1,
      span: 3,
      error: errors.address
    },
    {
      name: "address2",
      placeholder: "Address (line 2, optional)",
      value: address.line2,
      span: 3
    },
    {
      name: "city",
      placeholder: "City",
      value: city,
      span: 2,
      error: errors.city
    },
    {
      name: "zipCode",
      placeholder: "Zip Code",
      value: zipCode,
      span: 2,
      error: errors.zipCode,
      type: "number"
    },
    {
      name: "state",
      placeholder: "State",
      value: state,
      span: 2,
      error: errors.state,
      type: "select"
    }
  ];

  return (
    <div className="block">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <div className="grid grid-cols-6 gap-1">
        {inputs.map((input, i) => <AddressFormInput key={i} {...input as AddressFormInputProps} />)}
      </div>
    </div>
  );
}