import collectionMap from "@/utils/collectionMap";
import ProductList from "@/components/ProductList";
import fetchProducts from "../../../../lib/woocommerce";
import Hero from "@/components/Hero";
import type { CollectionPageProps, Product } from "../../../../types/types";

export const revalidate = 60; // Enable Incremental Static Regeneration

export async function generateStaticParams() {
  return Object.keys(collectionMap).map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const collection = collectionMap[slug];
  const images = collection?.carouselImages || [];

  if (!collection) {
    return <div className="p-10 text-center">Collection not found.</div>;
  }

  const allProducts: Product[] = await fetchProducts();
  const collectionProducts = allProducts.filter((product: Product) =>
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
            <p className="text-neutral-medium text-center text-lg font-light">
              No products assigned to this collection
            </p>
          )}
        </div>
      </section>
    </div>
  );
}