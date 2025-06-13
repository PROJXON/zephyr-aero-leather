import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { WooRestApiOptions } from "@woocommerce/woocommerce-rest-api";

// Runtime env check
const { WOOCOMMERCE_API_URL, WOOCOMMERCE_API_KEY, WOOCOMMERCE_API_SECRET } = process.env;

if (!WOOCOMMERCE_API_URL || !WOOCOMMERCE_API_KEY || !WOOCOMMERCE_API_SECRET) {
  throw new Error("WooCommerce environment variables are not properly set.");
}

const api = new WooCommerceRestApi({
  url: WOOCOMMERCE_API_URL,
  consumerKey: WOOCOMMERCE_API_KEY,
  consumerSecret: WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
  timeout: 30000,
} as WooRestApiOptions);

// You can refine this return type later with a WooOrder interface
export async function getWooOrder(id: number): Promise<any> {
  const res = await api.get(`orders/${id}`);
  return res.data;
}

// Accepts any shape — consider improving later with a proper WooOrderUpdate type
export async function updateWooOrder(id: number, data: Record<string, any>): Promise<any> {
  try {
    const res = await api.put(`orders/${id}`, data);
    return res.data;
  } catch (error: any) {
    console.error("Failed to update WooCommerce order:", error.response?.data || error.message);
    throw error;
  }
}
