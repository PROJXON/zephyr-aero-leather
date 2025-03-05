"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";

export default function ProductList({ products }) {
  const { addToCart } = useCart(); 

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
              onClick={() => addToCart(product.id)}
              className="mt-2 bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))
      )}
    </div>
  );
}
