import Link from "next/link";
import Image from "next/image";
import categoriesMap from "@/utils/categoriesMap";
import type { Category } from "../../../types/types";
import { JSX } from "react";

export default function CategoriesPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-neutral-dark">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-dark to-neutral-medium">
            Choose from our selection of High End Leather Products
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(categoriesMap).map(
            ([slug, { name, description, image }]: [string, Category]) => (
              <Link
                key={slug}
                href={`/categories/${slug}`}
                className="group bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-neutral-dark mb-2">
                    {name}
                  </h2>
                  <p className="text-neutral-medium text-lg">
                    {description}
                  </p>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
} 