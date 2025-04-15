"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";

export const CartContext = createContext({
  cartItems: [],
  cartOpen: false,
  setCartOpen: () => { },
  addToCart: () => { },
  removeFromCart: () => { },
  updateQuantity: () => { },
});

const pendingAdds = {}; // { [productId]: quantity }
const addTimers = {};   // { [productId]: timeout }

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [orderId, setOrderId] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);


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
        (data.items || []).map((item) => ({
          lineItemId: item.id,
          id: item.product_id,
          quantity: item.quantity,
        }))
      );
      setOrderId(data.orderId || null);
    } catch (error) {
      console.error("Error fetching cart:", error.message);
      setCartItems([]);
      setOrderId(null);
    }
  };

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
      if (!pendingAdds[productId]) pendingAdds[productId] = 0;
      pendingAdds[productId] += quantity;
  
      // Reset timer if one is already running
      clearTimeout(addTimers[productId]);
  
      // Set new timer
      addTimers[productId] = setTimeout(() => {
        const batchedQuantity = pendingAdds[productId];
        delete pendingAdds[productId];
  
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
      try {
        const response = await fetch("/api/cart/item", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, productId }),
        });

        if (!response.ok) throw new Error("Failed to remove item from cart");

        setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
        await fetchUserCart();
      } catch (error) {
        console.error("Error removing from cart:", error.message);
      }
    } else {
      const updatedCart = cartItems.filter((item) => item.id !== productId);
      saveGuestCart(updatedCart);
    }
  };


  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        const response = await fetch("/api/cart/item", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, productId, quantity }),
        });

        console.log(response)

        if (!response.ok) throw new Error("Failed to update cart quantity");

        await fetchUserCart();
      } catch (error) {
        console.error("Error updating cart:", error.message);
      }
    } else {
      const updatedCart = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      saveGuestCart(updatedCart);
    }
  };

  const syncGuestCartToWooCommerce = async () => {
    if (isAuthenticated && orderId) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      for (let item of guestCart) {
        await addToCart(item.id, item.quantity);
      }
      localStorage.removeItem("guestCart");
    }
  };

  // useEffect(() => {
  //   syncGuestCartToWooCommerce();
  // }, [isAuthenticated, orderId]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, setCartOpen, cartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
