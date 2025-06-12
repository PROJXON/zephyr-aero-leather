"use client";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ productId, className = "" }) {
  const { updateQuantity, cartItems, cartOpen, setCartOpen } = useCart();

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
