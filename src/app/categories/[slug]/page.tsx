import fetchProducts from "../../../../lib/woocommerce";
import ProductList from "../../../components/ProductList";
import categoryMap from "@/utils/categoryMap";
import categoryTitles from "@/utils/categoryTitles";
import Hero from "@/components/Hero";
import type { CategoryPageProps, Product } from "../../../../types/types";

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({ slug }));
}

export const revalidate = 60;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const products = await fetchProducts({ category: slug });

  const hero = categoryTitles[slug];

  const carouselImages = products
    .map((product: Product) => product?.images?.[0]?.src)
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {hero && (
        <Hero
          title={hero.title}
          subtitle={hero.subtitle}
          images={carouselImages}
        />
      )}

      <section className="container mx-auto px-4 py-16">
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p className="text-neutral-medium text-center text-lg font-light">No products found in this category.</p>
        )}
      </section>
    </div>
  );
} 