import { Product, CartItem } from "../types/types";
import fetchWooCommerce from "./fetchWooCommerce";

export default function getItemInfo(
  products: Product[],
  item: CartItem
): [Product | null, number] {
  const productId = item.productId ?? item.id;
  const itemInfo = products.find(product => product.id === productId);

  if (!itemInfo) {
    console.warn(`Product not found for item ID: ${productId}`);
    return [null, 0];
  }

  const price = typeof itemInfo.price === "string" ? parseFloat(itemInfo.price) : itemInfo.price;
  const priceInCents = Math.round(price * 100 * item.quantity);

  return [itemInfo, priceInCents];
}

export async function getItemInfoById(
  productId: number,
  quantity: number
): Promise<{ subtotalInDollars: string }> {
  const product = await fetchWooCommerce<Product>(`wc/v3/products/${productId}`, "Failed to fetch product");
  
  if (!product) {
    throw new Error(`Product not found for ID: ${productId}`);
  }

  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const subtotalInCents = Math.round(price * 100 * quantity);
  const subtotalInDollars = (subtotalInCents / 100).toFixed(2);

  return { subtotalInDollars };
}
