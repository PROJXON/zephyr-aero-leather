"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

export default function ProductList({ products }) {
  const { updateQuantity, addToCart, cartItems, cartOpen, setCartOpen } = useCart();

  const handleAddToCart = (productId) => {
    const currentQty = cartItems.find(item => item.id === productId)?.quantity || 0;
    updateQuantity(productId, currentQty + 1);
    // addToCart(productId);
    
    if (!cartOpen) {
      console.log('Cart is closed, opening now.');
      setCartOpen(true); // Only open the cart if it was closed
    } else {
      console.log('Cart is already open.');
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="p-4 border rounded shadow">
            <Image
              src={product.images[0]?.src || "/placeholder.jpg"}
              alt={product.name}
              width={300}
              height={200}
              className="object-cover"
            />
            <h2 className="text-lg font-bold">{product.name}</h2>
            <p className="text-gray-600">
              {product.price ? `$${product.price}` : "Price not available"}
            </p>

            <button
              onClick={() => handleAddToCart(product.id)}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 addToCartBtn"
            >
              Add to Cart
            </button>
          </div>
        ))
      )}
    </div>
  );
}
