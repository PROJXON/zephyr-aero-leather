import collectionMap from "@/utils/collectionMap";
import ProductList from "@/components/ProductList";
import fetchProducts from "../../../../lib/woocommerce";
import Hero from "@/components/Hero";
import type { Collection } from "../../../../types/types";
import type { Product } from "../../../../types/types";

export const revalidate = 60; // Enable Incremental Static Regeneration

type CollectionKey = keyof typeof collectionMap;

export async function generateStaticParams() {
  return Object.keys(collectionMap).map((slug) => ({ slug }));
}

interface CollectionPageProps {
  params: { slug: CollectionKey };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = params;
  const collection = collectionMap[slug as CollectionKey] as Collection | undefined;
  const images = collection?.carouselImages || [];

  if (!collection) {
    return <div className="p-10 text-center">Collection not found.</div>;
  }

  const allProducts: Product[] = await fetchProducts();
  const collectionProducts = allProducts.filter((product) =>
    collection.productIds.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title={collection.name}
        subtitle={collection.description}
        description={collection.description}
        images={images}
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          {collectionProducts.length > 0 ? (
            <ProductList products={collectionProducts} />
          ) : (
            <p className="text-neutral-medium">
              No products assigned to this collection.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}