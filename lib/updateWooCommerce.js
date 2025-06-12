import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
  timeout: 30000,
})

export async function getWooOrder(id) {
  const res = await api.get(`orders/${id}`)
  return res.data
}

export async function updateWooOrder(id, data) {
  try {
    console.log("Updating Woo order:", id, data);
    const res = await api.put(`orders/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Failed to update WooCommerce order:", error.response?.data || error.message);
    throw error;
  }
}


