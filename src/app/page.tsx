import fetchProducts from "../../lib/woocommerce";
import ProductList from "../components/ProductList";
import ProductCarousel from "@/components/ProductCarousel";
import Image from "next/image";
import Link from "next/link";
import Hero from "../components/Hero";
import { GiDiamondHard, GiHandSaw } from "react-icons/gi";
import { FaLeaf } from "react-icons/fa";
import type { JSX } from "react";
import type { SectionProps } from "../../types/types";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export const revalidate = 60;

const FeatureIcon = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }): JSX.Element => (
  <div className="text-center">
    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-secondary rounded-full transition duration-300 transform hover:-translate-y-1 hover:shadow-lg">
      <Icon className="text-5xl text-neutral-dark" />
    </div>
    <h3 className="text-lg font-medium mb-2 text-neutral-dark">{title}</h3>
    <p className="text-neutral-medium">{description}</p>
  </div>
);

export default async function Home(): Promise<JSX.Element> {
  const [
    wallets,
    iphoneCases,
    sunglasses,
    belts,
    bags,
    moto,
    holsters,
  ] = await Promise.all([
    fetchProducts({ category: "wallets", per_page: 8 }),
    fetchProducts({ category: "iphoneCases", per_page: 8 }),
    fetchProducts({ category: "sunglasses", per_page: 8 }),
    fetchProducts({ category: "belts", per_page: 8 }),
    fetchProducts({ category: "bags", per_page: 8 }),
    fetchProducts({ category: "moto", per_page: 8 }),
    fetchProducts({ category: "holsters", per_page: 8 }),
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
          `${CDN_URL}/phelanhelicopter.jpg`,
          `${CDN_URL}/phelanmotorcycle.jpg`,
          `${CDN_URL}/phelandesert.jpg`,
          `${CDN_URL}/phelancar.jpg`
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
            <FeatureIcon
              icon={GiDiamondHard}
              title="Premium Materials"
              description="Made with top-grain leather sourced from sustainable tanneries worldwide"
            />
            <FeatureIcon
              icon={GiHandSaw}
              title="Handcrafted"
              description="Each piece is meticulously crafted by skilled artisans with decades of experience"
            />
            <FeatureIcon
              icon={FaLeaf}
              title="Sustainable"
              description="Committed to ethical production and environmentally responsible practices"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

const Section = ({ title, products, link }: SectionProps): JSX.Element | null => {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16" data-aos="fade-up">
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
        <ProductCarousel products={products} viewAllLink={link} />
      </div>
    </section>
  );
};
