"use client";

import Image from "next/image";
import type { ReactElement } from "react";
import type { ProductImageCardProps } from "../../types/types";

export default function ProductImageCard({ src, alt, className = "" }: ProductImageCardProps): ReactElement {
  return (
    <div className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ease-out hover:scale-105 hover:shadow-xl ${className}`}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
      
      {/* Main image */}
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300"
        sizes="(max-width: 1000px) 100vw, 50vw"
      />
    </div>
  );
} 