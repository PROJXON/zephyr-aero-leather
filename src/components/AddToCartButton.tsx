"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import type { AddToCartButtonProps, CartContextType } from "../../types/types";

export default function AddToCartButton({ productId, className = "" }: AddToCartButtonProps) {
  const { updateQuantity, cartItems } = useCart() as CartContextType;
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const currentItem = cartItems.find(item => item.id === productId);
  const currentQty = currentItem?.quantity || 0;

  const showToast = (message: string) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1500); // Shorter, consistent duration
  };

  const handleAddToCart = () => {
    updateQuantity(productId, currentQty + 1);
    showToast("Cart updated!");
  };

  const handleIncrease = () => {
    updateQuantity(productId, currentQty + 1);
    showToast("Cart updated!");
  };

  const handleDecrease = () => {
    if (currentQty > 1) {
      updateQuantity(productId, currentQty - 1);
      showToast("Cart updated!");
    } else {
      updateQuantity(productId, 0); // Remove item
      showToast("Removed from cart!");
    }
  };

  const handleRemove = () => {
    updateQuantity(productId, 0);
    showToast("Removed from cart!");
  };

  // If item is in cart, show quantity controls
  if (currentQty > 0) {
    return (
      <>
        <div className={`flex items-center gap-1 ${className}`}>
          <button
            onClick={handleIncrease}
            className="w-7 h-7 rounded-full bg-neutral-light hover:bg-neutral-medium transition-colors flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          
          <span className="min-w-[1.5rem] text-center font-medium text-sm">{currentQty}</span>
          
          <button
            onClick={handleDecrease}
            className="w-7 h-7 rounded-full bg-neutral-light hover:bg-neutral-medium transition-colors flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          
          <button
            onClick={handleRemove}
            className="ml-1 text-xs text-neutral-medium hover:text-neutral-dark transition-colors"
            aria-label="Remove from cart"
          >
            Remove
          </button>
        </div>
        
        {/* Feedback Toast */}
        {showFeedback && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-neutral-dark text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{feedbackMessage}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  // If item is not in cart, show add button
  return (
    <>
      <button
        onClick={handleAddToCart}
        className={`addToCartBtn ${className}`}
      >
        Add to Cart
      </button>
      
      {/* Feedback Toast */}
      {showFeedback && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-neutral-dark text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{feedbackMessage}</span>
          </div>
        </div>
      )}
    </>
  );
}
