"use client";

import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import type { Product, ProductListProps } from "../../types/types";

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return <p className="text-neutral-medium">No products found.</p>;
  }

  // Log the first product's images to see what we're getting
  console.log('ProductList - First product images:', {
    productId: products[0].id,
    productName: products[0].name,
    images: products[0].images
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {products.map((product) => {
        const imageUrl = product.images?.[0]?.src;
        console.log(`ProductList - Processing product ${product.id}:`, {
          name: product.name,
          imageUrl,
          fullImages: product.images
        });

        return (
          <div 
            key={product.id} 
            className="group"
            data-aos="fade-up"
          >
            {/* Image Card */}
            <Link href={`/product/${product.id}`}>
              <div className="relative w-full h-[300px] bg-card mb-3 overflow-hidden shadow-sm rounded-xl">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={false}
                    quality={85}
                    onError={(e) => {
                      console.error(`ProductList - Image failed to load for product ${product.id}:`, {
                        imageUrl,
                        error: e
                      });
                      // Set placeholder on error
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                ) : (
                  <Image
                    src="/placeholder.jpg"
                    alt="Placeholder"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    priority={false}
                  />
                )}
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
        );
      })}
    </div>
  );
}