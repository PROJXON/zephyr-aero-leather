"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import type { ProductListProps } from "../../types/types";

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="text-neutral-medium">No products found</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div 
          key={product.id} 
          className="group"
          data-aos="fade-up"
        >
          {/* Image Card */}
          <Link href={`/product/${product.id}`}>
            <div className="relative w-full pt-[100%] bg-card mb-3 overflow-hidden shadow-sm rounded-xl">
              <div className="absolute inset-0">
                <Image
                  src={product.images?.[0]?.src || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority={false}
                />
              </div>
            </div>
          </Link>

          {/* Product Info */}
          <div>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-neutral-dark font-medium hover:underline">{product.name}</h3>
            </Link>
            <p className="text-neutral-medium mb-2 text-right w-full">
              {product.price ? `$${product.price}` : "Price not available"}
            </p>
            <div className="flex justify-end">
              <AddToCartButton
                productId={product.id}
                className="py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}