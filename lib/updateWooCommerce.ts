import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { WooRestApiOptions, WooOrder, WooOrderUpdate } from "../types/woocommerce";

const { WOOCOMMERCE_API_URL, WOOCOMMERCE_API_KEY, WOOCOMMERCE_API_SECRET } = process.env;

if (!WOOCOMMERCE_API_URL || !WOOCOMMERCE_API_KEY || !WOOCOMMERCE_API_SECRET) {
  throw new Error("WooCommerce environment variables are not properly set.");
}

const api = new WooCommerceRestApi({
  url: WOOCOMMERCE_API_URL,
  consumerKey: WOOCOMMERCE_API_KEY,
  consumerSecret: WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
  timeout: 60000,
} as WooRestApiOptions);

export async function getWooOrder(id: number): Promise<WooOrder> {
  const res = await api.get(`orders/${id}`);
  return res.data as WooOrder;
}

export async function updateWooOrder(id: number, data: WooOrderUpdate): Promise<WooOrder> {
  try {
    const res = await api.put(`orders/${id}`, data);
    return res.data as WooOrder;
  } catch (error: any) {
    console.error("Failed to update WooCommerce order:", error.response?.data || error.message);
    throw error;
  }
}
