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
  const { slug } = await params;
  const products = await fetchProducts({ category: slug });

  const hero = categoryTitles[slug];

  const carouselImages = products
    .map((product) => product?.images?.[0]?.src)
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

      <section className="container mx-auto px-6 md:px-12 lg:px-24 py-20">
        {products.length > 0 ? (
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark mb-6 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-dark to-neutral-medium">
                  {hero.title}
                </span>
              </h2>
              <p className="text-neutral-medium text-lg font-light tracking-wide">
                {hero.subtitle}
              </p>
            </div>
            <ProductList products={products} />
          </div>
        ) : (
          <p className="text-neutral-medium text-center text-lg font-light">No products found in this category.</p>
        )}
      </section>
    </div>
  );
}