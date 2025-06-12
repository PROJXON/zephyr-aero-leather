"use client";

import Image from "next/image";
import Link from "next/link";
import Carousel from "react-grid-carousel";
import AddToCartButton from "./AddToCartButton";

export default function ProductCarousel({ products, viewAllLink }) {
  if (!products || products.length === 0) {
    return <p className="text-neutral-medium">No products found.</p>;
  }

  const displayProducts = products.slice(0, 7);
  const showViewAll = products.length > 7;

  return (
    <Carousel cols={4} rows={1} gap={20} loop responsiveLayout={[
      { breakpoint: 1024, cols: 4 },
      { breakpoint: 768, cols: 2 },
      { breakpoint: 480, cols: 1 },
    ]}>
      {displayProducts.map((product) => (
        <Carousel.Item key={product.id}>
          <div className="group" data-aos="fade-up">
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
        </Carousel.Item>
      ))}

      {showViewAll && viewAllLink && (
        <Carousel.Item>
          <Link href={viewAllLink}>
            <div className="aspect-square flex items-center justify-center bg-neutral-light text-neutral-dark font-medium text-center rounded-xl shadow-sm hover:bg-neutral-medium transition-colors">
              View All Products →
            </div>
          </Link>
        </Carousel.Item>
      )}
    </Carousel>
  );
}
