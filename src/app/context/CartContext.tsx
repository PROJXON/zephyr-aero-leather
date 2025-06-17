"use client";
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import type { CartItem, CartContextType } from "../../../types/types";
import type { CartItemResponse } from "../../../types/woocommerce";

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const loadGuestCart = (): CartItem[] => {
  return JSON.parse(localStorage.getItem("guestCart") || "[]");
};

const saveGuestCart = (updatedCart: CartItem[]): void => {
  localStorage.setItem("guestCart", JSON.stringify(updatedCart));
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const pendingUpdates = useRef<Record<number, number>>({});
  const updateTimers = useRef<Record<number, NodeJS.Timeout>>({});
  const pendingRemovals = useRef<Record<number, boolean>>({});
  const removeTimers = useRef<Record<number, NodeJS.Timeout>>({});

  const fetchUserCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      setCartItems(
        (data.items || []).map((item: CartItemResponse) => ({
          lineItemId: item.id,
          id: item.product_id,
          quantity: item.quantity,
        }))
      );
      setOrderId(data.orderId || null);
    } catch (error: unknown) {
      console.error("Error fetching cart:", error instanceof Error ? error.message : 'Unknown error');
      setCartItems([]);
      setOrderId(null);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCart();
    } else {
      setCartItems(loadGuestCart());
    }
  }, [isAuthenticated, fetchUserCart]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    if (isAuthenticated) {
      setCartItems((prevItems) => {
        const updated = [...prevItems];
        const index = updated.findIndex((item) => item.id === productId);

        if (index > -1) {
          updated[index] = {
            ...updated[index],
            quantity: updated[index].quantity + quantity,
          };
        } else {
          updated.push({ id: productId, quantity });
        }

        return updated;
      });

      if (!pendingUpdates.current[productId]) pendingUpdates.current[productId] = 0;
      pendingUpdates.current[productId] += quantity;

      clearTimeout(updateTimers.current[productId]);

      updateTimers.current[productId] = setTimeout(() => {
        if (!isAuthenticated) return;
        const batchedQuantity = pendingUpdates.current[productId];
        delete pendingUpdates.current[productId];

        fetch("/api/cart/item", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, productId, quantity: batchedQuantity }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to add item to cart");
            return res.json();
          })
          .then(() => {
            fetchUserCart();
          })
          .catch((err) => {
            console.error("Error syncing cart with Woo:", err.message);
          });
      }, 300);
    } else {
      const updatedCart = [...cartItems];
      const itemIndex = updatedCart.findIndex((item) => item.id === productId);

      if (itemIndex > -1) {
        updatedCart[itemIndex].quantity += quantity;
      } else {
        updatedCart.push({
          id: productId,
          quantity,
        });
      }

      saveGuestCart(updatedCart);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (isAuthenticated) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
      pendingRemovals.current[productId] = true;
      clearTimeout(removeTimers.current[productId]);

      removeTimers.current[productId] = setTimeout(() => {
        if (!isAuthenticated) return;
        delete pendingRemovals.current[productId];

        fetch("/api/cart/item", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, productId }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to remove item from cart");
            return res.json();
          })
          .then(() => {
            fetchUserCart();
          })
          .catch((err) => {
            console.error("Error syncing cart removal with Woo:", err.message);
          });
      }, 300);
    } else {
      const updatedCart = cartItems.filter((item) => item.id !== productId);
      saveGuestCart(updatedCart);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (isAuthenticated) {
      setCartItems((prevItems) => {
        const updated = [...prevItems];
        const index = updated.findIndex((item) => item.id === productId);

        if (index > -1) {
          if (newQuantity > 0) {
            updated[index] = { ...updated[index], quantity: newQuantity };
          } else {
            updated.splice(index, 1);
          }
        } else if (newQuantity > 0) {
          updated.push({ id: productId, quantity: newQuantity });
        }

        return updated;
      });

      pendingUpdates.current[productId] = newQuantity;
      clearTimeout(updateTimers.current[productId]);

      updateTimers.current[productId] = setTimeout(() => {
        if (!isAuthenticated) return;
        const finalQuantity = pendingUpdates.current[productId];
        delete pendingUpdates.current[productId];

        fetch("/api/cart")
          .then((res) => res.json())
          .then(({ orderId: freshOrderId, items }) => {
            const existingItem = items.find((item: CartItemResponse) => item.product_id === productId);

            if (!existingItem && finalQuantity > 0) {
              return fetch("/api/cart/item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: freshOrderId, productId, quantity: finalQuantity }),
              });
            }

            const line_items = items.map((item: CartItemResponse) => ({
              id: item.id,
              quantity: item.product_id === productId ? finalQuantity : item.quantity,
            }));

            if (!existingItem && finalQuantity === 0) return;

            return fetch("/api/cart/item", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: freshOrderId, line_items }),
            });
          })
          .then((res) => {
            if (res && !res.ok) throw new Error("Failed to update cart");
            return res?.json?.();
          })
          .then(() => fetchUserCart())
          .catch((err) => {
            console.error("Error syncing cart:", err.message);
          });
      }, 300);
    } else {
      const updatedCart = [...cartItems];
      const index = updatedCart.findIndex((item) => item.id === productId);

      if (index > -1) {
        if (newQuantity > 0) {
          updatedCart[index].quantity = newQuantity;
        } else {
          updatedCart.splice(index, 1);
        }
      } else if (newQuantity > 0) {
        updatedCart.push({ id: productId, quantity: newQuantity });
      }

      saveGuestCart(updatedCart);
    }
  };

  const refreshCart = async () => {
    if (!isAuthenticated) return;
    const res = await fetch("/api/cart");
    if (!res.ok) return;
    const data = await res.json();

    setCartItems(
      (data.items || []).map((item: CartItemResponse) => ({
        lineItemId: item.id,
        id: item.product_id,
        quantity: item.quantity,
      }))
    );
    setOrderId(data.orderId || null);
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      if (!isAuthenticated) return;
      try {
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            line_items: [],
          }),
        });

        if (!response.ok) throw new Error("Failed to clear cart");

        setCartItems([]);
        setOrderId(null);
      } catch (error: unknown) {
        console.error("Error clearing cart:", error instanceof Error ? error.message : 'Unknown error');
      }
    } else {
      localStorage.removeItem("guestCart");
      setCartItems([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        setCartOpen,
        cartOpen,
        clearCart,
        orderId,
        fetchUserCart,
        setCartItems,
        refreshCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};