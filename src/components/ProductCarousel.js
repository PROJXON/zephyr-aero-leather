"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCarousel({ products, link }) {
  if (!products || products.length === 0) {
    return <p className="text-neutral-medium">No products found.</p>;
  }

  const displayProducts = products.slice(0, 7);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {displayProducts.map((product) => (
          <div
            key={product.id}
            className="group shrink-0"
            style={{ flexBasis: "clamp(180px, 45vw, 250px)" }}
          >
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

        {products.length > 7 && link && (
          <div
            className="group shrink-0 flex items-center justify-center text-center bg-neutral-light text-neutral-dark rounded-xl shadow-sm hover:bg-neutral-medium transition-colors cursor-pointer"
            style={{ flexBasis: "clamp(180px, 45vw, 250px)", minHeight: "250px" }}
          >
            <Link href={link} className="text-sm font-medium">
              View More →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
