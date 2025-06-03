import fetchProducts from "../../lib/woocommerce";
import ProductList from "../components/ProductList";
import Image from "next/image";

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
      {/* Hero Section */}
      <section className="relative bg-warm-bg">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-light text-neutral-dark leading-tight">
                Premium Leather <br />
                <span className="font-normal">Crafted for Adventure</span>
              </h1>
              <p className="text-neutral-medium text-lg max-w-md">
                Discover our collection of handcrafted leather goods designed for the modern adventurer.
              </p>
            </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                {/* First image (fades out) */}
                <div className="absolute inset-0 animate-carousel z-10">
                  <Image
                    src="/phelanhelicopter.jpg"
                    alt="Phelan Helicopter"
                    fill
                    className="object-cover object-top rounded-lg"
                    priority
                  />
                </div>

                {/* Second image (fades in) */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/phelanmotorcycle.jpg"
                    alt="Phelan Motorcycle"
                    fill
                    className="object-cover object-center rounded-lg"
                  />
                </div>
              </div>

          </div>
        </div>
      </section>

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
          <a href={link} className="text-sm text-blue-600 underline">View all</a>
        </div>
        <ProductList products={products} />
      </div>
    </section>
  );
};
