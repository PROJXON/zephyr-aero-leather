import fetchProducts from "../../lib/woocommerce";
import ProductList from "../components/ProductList";
import Image from "next/image";
import Link from "next/link";
import Hero from "../components/Hero";

export const revalidate = 60;

export default async function Home() {
  const [
    wallets,
    iphoneCases,
    sunglasses,
    belts,
    bags,
    moto,
    holsters,
  ] = await Promise.all([
    fetchProducts({ category: "wallets" }),
    fetchProducts({ category: "iphoneCases" }),
    fetchProducts({ category: "sunglasses" }),
    fetchProducts({ category: "belts" }),
    fetchProducts({ category: "bags" }),
    fetchProducts({ category: "moto" }),
    fetchProducts({ category: "holsters" }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Premium Leather"
        subtitle="Crafted for Adventure"
        images={[
          "/phelanhelicopter.jpg",
          "/phelanmotorcycle.jpg"
        ]}
      />

      {/* Grouped Product Sections */}
      <Section title="Wallets" products={wallets} link="/category/wallets" />
      <Section title="iPhone Leather Cases" products={iphoneCases} link="/category/iphone-cases" />
      <Section title="Sunglass Cases" products={sunglasses} link="/category/sunglasses" />
      <Section title="Belts" products={belts} link="/category/belts" />
      <Section title="Bags" products={bags} link="/category/bags" />
      <Section title="Moto Guzzi Collection" products={moto} link="/category/moto-guzzi" />
      <Section title="Shoulder Holsters" products={holsters} link="/category/shoulder-holsters" />

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl text-neutral-dark font-normal mb-12">
            Why Choose Zephyr Aero Leather
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-secondary rounded-full">
                <Image src="/images/premium-icon.svg" alt="Premium Materials" width={32} height={32} />
              </div>
              <h3 className="text-lg font-medium mb-2 text-neutral-dark">Premium Materials</h3>
              <p className="text-neutral-medium">
                Made with top-grain leather sourced from sustainable tanneries worldwide.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-secondary rounded-full">
                <Image src="/images/handcrafted-icon.svg" alt="Handcrafted" width={32} height={32} />
              </div>
              <h3 className="text-lg font-medium mb-2 text-neutral-dark">Handcrafted</h3>
              <p className="text-neutral-medium">
                Each piece is meticulously crafted by skilled artisans with decades of experience.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-secondary rounded-full">
                <Image src="/images/sustainable-icon.svg" alt="Sustainable" width={32} height={32} />
              </div>
              <h3 className="text-lg font-medium mb-2 text-neutral-dark">Sustainable</h3>
              <p className="text-neutral-medium">
                Committed to ethical production and environmentally responsible practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Reusable Section component
const Section = ({ title, products, link }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl text-neutral-dark font-normal">{title}</h2>
            <Link
              href={link}
              className="py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors"
            >
              View All
            </Link>        
        </div>
        <ProductList products={products} />
      </div>
    </section>
  );
};
