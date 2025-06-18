"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import type { ProductCarouselProps, CarouselProduct } from "../../types/types";

export default function ProductCarousel({
  products,
  viewAllLink,
}: ProductCarouselProps) {
  const displayProducts = products.slice(0, 7);
  const showViewAll = products.length > 7;

  const finalProducts = showViewAll
    ? [...displayProducts, { id: "view-all" } as CarouselProduct]
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
      className="w-full"
    >
      {finalProducts.map((product) => (
        <SplideSlide key={product.id} className="flex justify-center">
          <div className="w-full sm:max-w-[768px] flex flex-col">
            {product.id === "view-all" ? (
              <div className="group flex flex-col" data-aos="fade-up">
                <Link href={viewAllLink}>
                  <div className="relative w-full pt-[100%] bg-neutral-light mb-3 overflow-hidden shadow-sm rounded-xl group-hover:bg-neutral-medium transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-neutral-dark font-medium text-center group-hover:scale-105 transition-transform duration-300">
                        View All Products →
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col justify-between flex-1">
                  <div className="h-[1.5em]"></div>
                  <div className="h-[1.5em]"></div>
                  <div className="h-[2.5em]"></div>
                </div>
              </div>
            ) : (
              <div className="group flex flex-col" data-aos="fade-up">
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