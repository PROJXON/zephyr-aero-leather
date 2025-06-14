import fetchWooCommerce from "./fetchWooCommerce"

export default async function syncAddress(paymentIntentObjAddr, addressObj, woo_order_id, billing) {
  const { name, address, city, zipCode, state } = addressObj
  paymentIntentObjAddr = {
    name: `${name.first} ${name.last}`,
    address: {
      line1: address.line1,
      line2: address.line2,
      city,
      postal_code: zipCode,
      state,
      country: "US"
    }
  }

  if (woo_order_id) {
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
      wooDetails)
  }
}