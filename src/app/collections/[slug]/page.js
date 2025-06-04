import collectionMap from "@/utils/collectionMap";
import ProductList from "@/components/ProductList";
import fetchProducts from "../../../../lib/woocommerce";
import Image from "next/image";
import HeroCarousel from "@/components/HeroCarousel";

export async function generateStaticParams() {
  return Object.keys(collectionMap).map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }) {
  const { slug } = params;
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
      <section className="relative bg-warm-bg">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-light text-neutral-dark leading-tight">
                {collection.name} <br />
                <span className="font-normal">{collection.description}</span>
              </h1>
            </div>
              <HeroCarousel images={images} altBase={collection.name} />
          </div>
        </div>
      </section>


      <section className="py-16">
        <div className="container mx-auto px-4">

          {collectionProducts.length > 0 ? (
            <ProductList products={collectionProducts} />
          ) : (
            <p className="text-neutral-medium">No products assigned to this collection.</p>
          )}
        </div>
      </section>
    </div>
  );
}
