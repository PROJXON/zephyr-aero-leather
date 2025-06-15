"use client";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCarousel({ products, viewAllLink }) {
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
            <div className="w-full max-w-[120px] sm:max-w-[280px] mx-auto flex flex-col">
              <div className="group flex flex-col" data-aos="fade-up">
                <Link href={`/product/${product.id}`}>
                  <div className="relative w-full aspect-square bg-card mb-1.5 overflow-hidden shadow-sm rounded-lg">
                    <Image
                      src={product.images[0]?.src || "/placeholder.jpg"}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 120px, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      priority={false}
                    />
                  </div>
                </Link>
                <div className="flex flex-col justify-between flex-1 px-0.5">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-[10px] sm:text-sm text-neutral-dark font-medium hover:underline line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-[10px] sm:text-sm text-neutral-medium mt-0.5 mb-0.5 text-right w-full">
                    {product.price ? `$${product.price}` : "Price not available"}
                  </p>
                  <div className="flex justify-end">
                    <AddToCartButton
                      productId={product.id}
                      className="py-0.5 px-1 sm:py-1.5 sm:px-3 text-[9px] sm:text-xs font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors"
                    />
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
