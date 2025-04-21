"use client";
import { useCart } from "@/app/context/CartContext";

export default function AddToCartButton({ productId }) {
  const { updateQuantity, cartItems, cartOpen, setCartOpen } = useCart();

  const handleAddToCart = () => {
    const currentQty = cartItems.find(item => item.id === productId)?.quantity || 0;
    updateQuantity(productId, currentQty + 1);
    
    if (!cartOpen) {
      setCartOpen(true);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Add to Cart
    </button>
  );
} 