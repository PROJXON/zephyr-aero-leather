import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { WooRestApiOptions, WooOrder, WooOrderUpdate, WooError, WooRestResponse } from "../types/woocommerce";

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

export async function getWooOrder(id: number): Promise<WooOrder> {
  const res: WooRestResponse<WooOrder> = await api.get(`orders/${id}`);
  return res.data;
}

export async function updateWooOrder(id: number, data: WooOrderUpdate): Promise<WooOrder> {
  try {
    const res: WooRestResponse<WooOrder> = await api.put(`orders/${id}`, data);
    return res.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "message" in error) {
      const err = error as WooError;
      console.error("Failed to update WooCommerce order:", err.data || err.message);
      throw err;
    } else {
      console.error("Unknown WooCommerce order update error:", error);
      throw error;
    }
  }
}
