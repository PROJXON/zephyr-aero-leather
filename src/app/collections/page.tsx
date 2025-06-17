import Link from "next/link";
import Image from "next/image";
import collectionMap from "@/utils/collectionMap";
import type { CollectionMap } from "../../../types/types";

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-dark tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-dark to-neutral-medium">
            Our Collections
          </span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {Object.entries(collectionMap).map(([slug, { name, description, image }]) => (
            <Link
              key={slug}
              href={`/collections/${slug}`}
              className="group bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-neutral-dark mb-3 tracking-wide">
                  {name}
                </h2>
                <p className="text-neutral-medium text-base font-light tracking-wide">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 