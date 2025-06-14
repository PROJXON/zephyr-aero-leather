import fetchProducts from "../../../../lib/woocommerce";
import ProductList from "../../../components/ProductList";
import categoryMap from "@/utils/categoryMap";
import categoryTitles from "@/utils/categoryTitles";
import Hero from "@/components/Hero";
import type { CategoryTitlesMap } from "../../../../types/types";

type CategoryKey = keyof typeof categoryMap;

export async function generateStaticParams() {
  return Object.keys(categoryMap).map((slug) => ({ slug }));
}

export const revalidate = 60;

interface CategoryPageProps {
  params: { slug: CategoryKey };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const products = await fetchProducts({ category: slug });

  const hero = (categoryTitles as CategoryTitlesMap)[slug];

  const carouselImages = products
    .map((product) => product?.images?.[0]?.src)
    .filter((src): src is string => Boolean(src))
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
          <p className="text-neutral-medium">No products found in this category.</p>
        )}
      </section>
    </div>
  );
}