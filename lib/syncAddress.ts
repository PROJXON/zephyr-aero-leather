import fetchWooCommerce from "./fetchWooCommerce";
import { AddressDetailsState, State } from "../types/types";
import { WooCommerceAddress, WooOrderUpdate } from "../types/woocommerce";

export default async function syncAddress(
  addressObj: AddressDetailsState,
  woo_order_id: number | undefined,
  billing: boolean
): Promise<void> {
  const { name, address, city, zipCode, state } = addressObj;

  const wooDetails: WooOrderUpdate = {
    meta_data: [
      {
        key: "user_local_time",
        value: new Date().toISOString()
      }
    ]
  };

  const wooAddress: WooCommerceAddress = {
    first_name: name.first,
    last_name: name.last,
    address_1: address.line1,
    address_2: address.line2 as string,
    city,
    postcode: zipCode,
    state: state as State,
    country: "US"
  };

  if (billing) {
    wooDetails.billing = wooAddress;
  } else {
    wooDetails.shipping = wooAddress;
  }

  return await fetchWooCommerce(
    `wc/v3/orders/${woo_order_id}`,
    `Failed to update ${billing ? "billing" : "shipping"} details`,
    null,
    "PUT",
    wooDetails
  );
}