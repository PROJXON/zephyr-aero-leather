import type { WooOrder, WooOrderUpdate } from "../types/woocommerce";
import getWooCommerceApi from "./woocommerceApi";

const api = getWooCommerceApi();

export async function getWooOrder(id: number): Promise<WooOrder> {
  const res = await api.get(`orders/${id}`);
  return res.data as WooOrder;
}

export async function updateWooOrder(id: number, data: WooOrderUpdate): Promise<WooOrder> {
  try {
    const res = await api.put(`orders/${id}`, data);
    return res.data as WooOrder;
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number } };
    console.error("Failed to update WooCommerce order:", err.response?.data || err);
    throw error;
  }
}
