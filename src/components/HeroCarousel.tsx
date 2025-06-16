"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import type { HeroCarouselProps } from "../../types/types";
import type { ReactElement } from "react";

export default function HeroCarousel({
  images,
  altBase = "Hero",
}: HeroCarouselProps): ReactElement {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const delay = 5000; // 5 seconds
  const isHoveredRef = useRef(false);

  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isHoveredRef.current) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % images.length);
      }, delay);
    }
  }, [images.length, delay]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startInterval]);

  const goToSlide = (index: number) => {
    setCurrent(index);
    startInterval(); // reset timer on manual change
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return (
    <div
      className="relative w-full h-[350px] sm:h-[450px] max-w-[550px] mx-auto rounded-xl overflow-hidden shadow-md"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {images.map((src, index) => (
        <div
          key={`${src}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`${altBase} Image ${index + 1}`}
            fill
            className="object-cover object-center w-full h-full rounded-xl"
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            } transition-colors`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
