import { CartItem, Product } from "../types/types";
import getItemInfo from "./getItemInfo";

export default function calculateTotal(cartItems: CartItem[], products: Product[]): number {
  return cartItems.reduce((total, item) => {
    const [, priceInCents] = getItemInfo(products, item);
    return total + priceInCents;
  }, 0);
}
