import fetchProducts from "../../../../lib/woocommerce";
import ProductList from "../../../components/ProductList";

import categoryMap from "@/utils/categoryMap";

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const products = await fetchProducts({ category: slug });

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold text-neutral-dark mb-6 capitalize">
          {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>

        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p className="text-neutral-medium">No products found in this category.</p>
        )}
      </section>
    </div>
  );
}
