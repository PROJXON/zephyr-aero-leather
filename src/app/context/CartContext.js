"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";

export const CartContext = createContext({
  cartItems: [],
  cartOpen: false,
  setCartOpen: () => { },
  addToCart: () => { },
  removeFromCart: () => { },
  updateQuantity: () => { },
  orderId: null
});

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false)

  const pendingUpdates = useRef({});
  const updateTimers = useRef({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserCart();
    } else {
      loadGuestCart();
    }
  }, [isAuthenticated]);

  const loadGuestCart = () => {
    const savedCart = JSON.parse(localStorage.getItem("guestCart")) || [];
    setCartItems(savedCart);
  };

  const saveGuestCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("guestCart", JSON.stringify(updatedCart));
  };

  const fetchUserCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      setCartItems(
        (data.items || []).map(item => ({
          lineItemId: item.id,
          id: item.product_id,
          quantity: item.quantity,
        }))
      )
      setOrderId(data.orderId || null)
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      setCartItems([]);
      setOrderId(null);
    }
  }

  const addToCart = async (productId, quantity = 1) => {
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

      // Accumulate quantity in memory
      if (!pendingUpdates.current[productId]) pendingUpdates.current[productId] = 0;
      pendingUpdates.current[productId] += quantity;


      // Reset timer if one is already running
      clearTimeout(updateTimers.current[productId]);

      // Set new timer
      updateTimers.current[productId] = setTimeout(() => {
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
          quantity
        });
      }

      saveGuestCart(updatedCart);
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      // 1. Optimistically update UI
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

      // 2. Mark this product for removal
      pendingRemovals[productId] = true;

      // 3. Clear any existing timer
      clearTimeout(removeTimers[productId]);

      // 4. Set new timer to debounce removal
      removeTimers[productId] = setTimeout(() => {
        delete pendingRemovals[productId];

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
            fetchUserCart(); // Sync final cart state
          })
          .catch((err) => {
            console.error("Error syncing cart removal with Woo:", err.message);
          });
      }, 300); // Same delay as addToCart
    } else {
      const updatedCart = cartItems.filter((item) => item.id !== productId);
      saveGuestCart(updatedCart);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
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
        const finalQuantity = pendingUpdates.current[productId];
        delete pendingUpdates.current[productId];

        fetch("/api/cart")
          .then(res => res.json())
          .then(({ orderId: freshOrderId, items }) => {
            const existingItem = items.find(item => item.product_id === productId);

            if (!existingItem && finalQuantity > 0) {
              // 🆕 It's a new item — use POST
              return fetch("/api/cart/item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: freshOrderId, productId, quantity: finalQuantity }),
              });
            }

            // 🧼 Otherwise build full sanitized line_items
            const line_items = items.map((item) => {
              return {
                id: item.id,
                quantity: item.product_id === productId ? finalQuantity : item.quantity,
              };
            });

            // If removing, and it’s not in Woo yet, nothing to do
            if (!existingItem && finalQuantity === 0) return

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
      // guest logic unchanged
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
    const res = await fetch("/api/cart");
    if (!res.ok) return;
    const data = await res.json();

    setCartItems(
      (data.items || []).map(item => ({
        lineItemId: item.id,
        id: item.product_id,
        quantity: item.quantity,
      }))
    );
    setOrderId(data.orderId || null);
  };


  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
          orderId,
          line_items: [], // ← force clear Woo cart
          }),
        });

        if (!response.ok) throw new Error("Failed to clear cart");

        setCartItems([]);
        setOrderId(null);

      } catch (error) {
        console.error("Error clearing cart:", error.message);
      }
    } else {
      localStorage.removeItem("guestCart");
      setCartItems([]);
    }
  };
  
  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      updateQuantity,
      setCartOpen,
      cartOpen,
      clearCart,
      orderId,
      fetchUserCart,
      setCartItems,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
