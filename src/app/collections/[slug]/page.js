import collectionMap from "@/utils/collectionMap";
import ProductList from "@/components/ProductList";
import fetchProducts from "../../../../lib/woocommerce";

export async function generateStaticParams() {
  return Object.keys(collectionMap).map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }) {
  const { slug } = params;
  const collection = collectionMap[slug];

  if (!collection) {
    return <div className="p-10 text-center">Collection not found.</div>;
  }

  const allProducts = await fetchProducts();
  const collectionProducts = allProducts.filter((product) =>
    collection.productIds.includes(product.id)
  );

  return (
    <div className="min-h-screen bg-background py-16 px-4 container mx-auto">
      <h1 className="text-3xl font-semibold mb-4">{collection.name}</h1>
      <p className="text-neutral-medium mb-8">{collection.description}</p>

      {collectionProducts.length > 0 ? (
        <ProductList products={collectionProducts} />
      ) : (
        <p>No products assigned to this collection.</p>
      )}
    </div>
  );
}
