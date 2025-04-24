"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";

export default function ProductList({ products }) {
  const { updateQuantity, cartItems, cartOpen, setCartOpen } = useCart();

  const handleAddToCart = (productId) => {
    const currentQty = cartItems.find(item => item.id === productId)?.quantity || 0;
    updateQuantity(productId, currentQty + 1);

    if (!cartOpen) {
      setCartOpen(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => (
          <div key={product.id} className="border rounded-lg shadow-sm overflow-hidden">
            <Link href={`/product/${product.id}`}>
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]?.src || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link href={`/product/${product.id}`}>
                <h2 className="text-lg font-semibold mb-2 hover:text-blue-600">{product.name}</h2>
              </Link>
              <p className="text-gray-600 mb-4">
                {product.price ? `$${product.price}` : "Price not available"}
              </p>
              <button
                onClick={() => handleAddToCart(product.id)}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
