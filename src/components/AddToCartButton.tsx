"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import type { AddToCartButtonProps, CartContextType } from "../../types/types";

export default function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const { updateQuantity, cartItems, cartOpen, setCartOpen } = useCart() as CartContextType;
  const [showFeedback, setShowFeedback] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleAddToCart = () => {
    const currentQty = cartItems.find(item => item.id === productId)?.quantity || 0;
    updateQuantity(productId, currentQty + 1);
    
    // Desktop: open cart dropdown
    if (!cartOpen && !isMobile) {
      setCartOpen(true);
    }
    
    // Show feedback toast on both mobile and desktop
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className={`addToCartBtn ${className}`}
      >
        Add to Cart
      </button>
      
      {/* Mobile Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-neutral-dark text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Added to cart!</span>
          </div>
        </div>
      )}
    </>
  );
}
