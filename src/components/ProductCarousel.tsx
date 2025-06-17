"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import type { Product } from "../../types/types";

interface ProductCarouselProps {
  products: Product[];
  viewAllLink: string;
}

export default function ProductCarousel({ products, viewAllLink }: ProductCarouselProps) {
  // Show 6 products in the carousel
  const displayProducts = products.slice(0, 6);

  return (
    <div className="relative w-full overflow-hidden">
      <Splide
        options={{
          perPage: 4,
          gap: "1rem",
          drag: true,
          pagination: false,  
          arrows: true,
          type: "slide",
          autoplay: false,
          breakpoints: {
            1280: { perPage: 3 },  
            1024: { perPage: 2 },  
            640: { 
              perPage: 4,         
              gap: "0.25rem",     
              arrows: true,       
              pagination: false   
            }
          },
        }}
        className="w-full"
      >
        {displayProducts.map((product) => (
          <SplideSlide key={product.id} className="flex justify-center">
            <div className="w-full max-w-[120px] sm:max-w-[280px] mx-auto">
              <div className="group" data-aos="fade-up">
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full pt-[100%] bg-card mb-3 overflow-hidden shadow-sm rounded-xl">
                    <div className="absolute inset-0">
                      <Image
                        src={product.images?.[0]?.src || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 120px, (max-width: 1024px) 280px, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="flex flex-col h-[120px]">
                  <Link href={`/product/${product.id}`} className="flex-grow">
                    <h3 className="text-xs text-neutral-dark font-medium hover:underline line-clamp-2">{product.name}</h3>
                  </Link>
                  <div className="mt-auto pt-2">
                    <p className="text-neutral-medium mb-2 text-right w-full">
                      {product.price ? `$${product.price}` : "Price not available"}
                    </p>
                    <div className="flex justify-end">
                      <AddToCartButton
                        productId={product.id}
                        className="py-1 px-2 sm:py-2 sm:px-4 text-xs sm:text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
} 