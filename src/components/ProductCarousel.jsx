"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCarousel({ products, viewAllLink }) {
  const displayProducts = products.slice(0, 7);
  const showViewAll = products.length > 7;

  const finalProducts = showViewAll
    ? [...displayProducts, { id: "view-all" }]
    : displayProducts;

  return (
    <Splide
      options={{
        perPage: 4,
        gap: "1rem",
        drag: "free",
        pagination: false,
        breakpoints: {
          1024: { perPage: 2 },
        },
      }}
      className="w-full max-w-screen-xl mx-auto px-2 sm:px-0"
    >
      {finalProducts.map((product) => (
        <SplideSlide key={product.id} className="flex justify-center min-w-0 px-0">
          <div
            className="
              w-full 
              flex flex-col 
              px-2 
              max-w-[calc(50vw-1rem)] 
              sm:max-w-[calc(45vw-1rem)] 
              md:max-w-[300px]
            "
          >
            {product.id === "view-all" ? (
              <Link href={viewAllLink}>
                <div className="aspect-square flex items-center justify-center bg-neutral-light text-neutral-dark font-medium text-center rounded-xl shadow-sm hover:bg-neutral-medium transition-colors">
                  View All Products →
                </div>
              </Link>
            ) : (
              <div className="group flex flex-col" data-aos="fade-up">
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full aspect-square bg-card mb-3 overflow-hidden shadow-sm rounded-xl">
                    <Image
                      src={product.images[0]?.src || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
                <div className="flex flex-col justify-between flex-1">
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
            )}
          </div>
        </SplideSlide>
      ))}
    </Splide>
  );
}
