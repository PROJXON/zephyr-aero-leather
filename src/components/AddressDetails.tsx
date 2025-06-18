import AddressFormInput from "./AddressFormInput";
import type { AddressDetailsState, AddressErrors } from "../../types/types";

export default function AddressDetails({ title, details, errors }: {
  title: string;
  details: AddressDetailsState;
  errors: AddressErrors;
}) {
  const { name, address, city, zipCode, state } = details;

  return (
    <div className="block">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <AddressFormInput
              name="firstName"
              placeholder="First Name"
              value={name.first || ""}
              error={errors.firstName || ""}
              span={1}
              type="text"
            />
          </div>
          <div className="flex-1">
            <AddressFormInput
              name="lastName"
              placeholder="Last Name"
              value={name.last || ""}
              error={errors.lastName || ""}
              span={1}
              type="text"
            />
          </div>
        </div>
        <div>
          <AddressFormInput
            name="address1"
            placeholder="Address (line 1)"
            value={address.line1 || ""}
            error={errors.address || ""}
            span={1}
            type="text"
          />
        </div>
        <div>
          <AddressFormInput
            name="address2"
            placeholder="Address (line 2, optional)"
            value={address.line2 || ""}
            error=""
            span={1}
            type="text"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-[2]">
            <AddressFormInput
              name="city"
              placeholder="City"
              value={city || ""}
              error={errors.city || ""}
              span={1}
              type="text"
            />
          </div>
          <div className="flex-[1]">
            <AddressFormInput
              name="zipCode"
              placeholder="ZIP Code"
              value={zipCode || ""}
              error={errors.zipCode || ""}
              span={1}
              type="text"
            />
          </div>
          <div className="flex-[1]">
            <AddressFormInput
              name="state"
              placeholder="State"
              value={state || ""}
              error={errors.state || ""}
              type="select"
              span={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}