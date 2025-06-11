"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCarousel({ products }) {
  if (!products || products.length === 0) {
    return <p className="text-neutral-medium">No products found.</p>;
  }

  return (
    <div className="px-4">
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[75vw] sm:min-w-[50vw] md:min-w-[33vw] lg:min-w-[20vw] max-w-[300px] group shrink-0"
          >
            {/* Image Card */}
            <Link href={`/product/${product.id}`}>
              <div className="relative aspect-square bg-card mb-3 overflow-hidden shadow-sm rounded-xl">
                <Image
                  src={product.images[0]?.src || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div>
              <Link href={`/product/${product.id}`}>
                <h3 className="text-neutral-dark font-medium hover:underline">
                  {product.name}
                </h3>
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
    </div>
  );
}
