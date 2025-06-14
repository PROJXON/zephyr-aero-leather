"use client";
import { useCart } from "@/app/context/CartContext";
import type { AddToCartButtonProps, CartContextType } from "../../types/types";

export default function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const { updateQuantity, cartItems, cartOpen, setCartOpen } = useCart() as CartContextType;

  const handleAddToCart = () => {
    const currentQty = cartItems.find(item => item.id === productId)?.quantity || 0;
    updateQuantity(productId, currentQty + 1);
    if (!cartOpen) setCartOpen(true);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`addToCartBtn ${className}`}
    >
      Add to Cart
    </button>
  );
}
