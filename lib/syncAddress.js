import fetchWooCommerce from "./fetchWooCommerce"

export default async function syncAddress(addressObj, woo_order_id, billing) {
  const { name, address, city, zipCode, state } = addressObj

  const wooDetails = {
    meta_data: [
      {
        key: "user_local_time",
        value: new Date().toISOString()
      }
    ]
  }

  const wooAddress = {
    first_name: name.first,
    last_name: name.last,
    address_1: address.line1,
    address_2: address.line2,
    city,
    postcode: zipCode,
    state,
    country: "US"
  }

  if (billing) wooDetails.billing = wooAddress
  else wooDetails.shipping = wooAddress

  await fetchWooCommerce(
    `wc/v3/orders/${woo_order_id}`,
    `Failed to update ${billing ? "billing" : "shipping"} details`,
    null,
    "PUT",
    wooDetails
  )
}