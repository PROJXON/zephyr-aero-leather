"use client"
import Image from "next/image"
import Link from "next/link"
import AddToCartButton from "./AddToCartButton"

export default function ProductList({ products }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.length === 0 ? (
        <p className="text-neutral-medium">No products found.</p>
      ) : (
        products.map(product => (
          <div key={product.id} className="group">
            <div className="relative aspect-square bg-card mb-3 overflow-hidden shadow-sm">
              <Link href={`/product/${product.id}`}>
                <Image
                  src={product.images[0]?.src || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>
            <div className="space-y-2">
              <Link href={`/product/${product.id}`}>
                <h3 className="text-neutral-dark font-medium hover:text-primary transition-colors">{product.name}</h3>
              </Link>
              <p className="text-neutral-medium">
                {product.price ? `$${product.price}` : "Price not available"}
              </p>
              <AddToCartButton 
                productId={product.id} 
                className="w-full bg-primary hover:bg-accent text-white rounded-none px-4 py-2 transition-colors" 
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
