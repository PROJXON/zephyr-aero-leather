"use client";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ productId, className }) {
  const { updateQuantity, cartItems, cartOpen, setCartOpen } = useCart();

  const handleAddToCart = () => {
    const currentQty = cartItems.find(item => item.id === productId)?.quantity || 0;
    updateQuantity(productId, currentQty + 1);

    if (!cartOpen) setCartOpen(true)
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`bg-blue-500 text-white hover:bg-blue-600 transition-colors addToCartBtn ${className}`}
    >
      Add to Cart
    </button>
  );
} 