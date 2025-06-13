import { Product, CartItem } from "../types/types";

export default function getItemInfo(
  products: Product[],
  item: CartItem
): [Product | null, number] {
  const itemInfo = products.find(product => product.id === item.id);

  if (!itemInfo) {
    console.warn(`Product not found for item ID: ${item.id}`);
    return [null, 0];
  }

  const price = typeof itemInfo.price === "string" ? parseFloat(itemInfo.price) : itemInfo.price;
  const priceInCents = Math.round(price * 100 * item.quantity);

  return [itemInfo, priceInCents];
}
