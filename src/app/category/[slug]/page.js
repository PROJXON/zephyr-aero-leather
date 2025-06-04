import fetchProducts from "../../../../lib/woocommerce";
import ProductList from "../../../components/ProductList";
import categoryMap from "@/utils/categoryMap";
import categoryTitles from "@/utils/categoryTitles";
import Hero from "@/components/Hero";

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({ slug }));
}

export const revalidate = 60;

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const products = await fetchProducts({ category: slug });

  const hero = categoryTitles[slug];

  return (
    <div className="min-h-screen bg-background">
      {hero && (
        <Hero
          title={hero.title}
          subtitle={hero.subtitle}
          images={hero.images}
        />
      )}

      <section className="container mx-auto px-4 py-16">
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p className="text-neutral-medium">No products found in this category.</p>
        )}
      </section>
    </div>
  );
}
