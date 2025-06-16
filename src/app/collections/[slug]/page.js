import collectionMap from "@/utils/collectionMap";
import ProductList from "@/components/ProductList";
import fetchProducts from "../../../../lib/woocommerce";
import Hero from "@/components/Hero";

export const revalidate = 60; // <-- Enable Incremental Static Regeneration

export async function generateStaticParams() {
  return Object.keys(collectionMap).map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }) {
  const { slug } = await params;
  const collection = collectionMap[slug];
  const images = collection?.carouselImages || [];

  if (!collection) {
    return <div className="p-10 text-center">Collection not found.</div>;
  }

  const allProducts = await fetchProducts();
  const collectionProducts = allProducts.filter((product) =>
    collection.productIds.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title={collection.name}
        subtitle={collection.description}
        images={images}
      />

      <section className="container mx-auto px-6 md:px-12 lg:px-24 py-20">
        {collectionProducts.length > 0 ? (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-dark to-neutral-medium">
                  {collection.name}
                </span>
              </h2>
              <p className="text-neutral-medium text-lg font-light tracking-wide">
                {collection.description}
              </p>
            </div>
            <ProductList products={collectionProducts} />
          </div>
        ) : (
          <p className="text-neutral-medium text-center text-lg font-light">
            No products assigned to this collection.
          </p>
        )}
      </section>
    </div>
  );
}
