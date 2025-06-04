import fetchProducts from "../../../../lib/woocommerce";
import ProductList from "../../../components/ProductList";

import categoryMap from "@/utils/categoryMap";
import categoryTitles from "@/utils/categoryTitles";

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({ slug }));
}

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const products = await fetchProducts({ category: slug });

  const title = categoryTitles[slug] || slug;

  return (
    <div className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-3xl text-neutral-dark mb-6">{title}</h1>

        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p className="text-neutral-medium">No products found in this category.</p>
        )}
      </section>
    </div>
  );
}
