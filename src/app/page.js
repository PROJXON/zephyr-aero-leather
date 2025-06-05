import fetchProducts from "../../lib/woocommerce"
import Image from "next/image";
import Hero from "../components/Hero";
import fetchProducts from "../../lib/woocommerce"
import Section from "../components/Section"
import Image from "next/image"

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
    fetchProducts({ category: "wallets", per_page: 4 }),
    fetchProducts({ category: "iphoneCases", per_page: 4 }),
    fetchProducts({ category: "sunglasses", per_page: 4 }),
    fetchProducts({ category: "belts", per_page: 4 }),
    fetchProducts({ category: "bags", per_page: 4 }),
    fetchProducts({ category: "moto", per_page: 4 }),
    fetchProducts({ category: "holsters", per_page: 4 }),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Hero
        title="Zephyr Aero Leather"
        subtitle={
          <>
            Designed for Flight
            <br />
            Made for Life
          </>
        }
        description="Premium handcrafted leather goods for aviators, adventurers, and everyday explorers"
        images={[
          "/phelanhelicopter.jpg",
          "/phelanmotorcycle.jpg",
          "/phelandesert.jpg",
          "/phelancar.jpg"
        ]}
      />

      {/* Grouped Product Sections */}
      <Section title="Wallets" products={wallets} link="/categories/wallets" />
      <Section title="iPhone Leather Cases" products={iphoneCases} link="/categories/iphoneCases" />
      <Section title="Sunglass Cases" products={sunglasses} link="/categories/sunglasses" />
      <Section title="Belts" products={belts} link="/categories/belts" />
      <Section title="Bags" products={bags} link="/categories/bags" />
      <Section title="Moto Guzzi Collection" products={moto} link="/categories/moto" />
      <Section title="Shoulder Holsters" products={holsters} link="/categories/holsters" />

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