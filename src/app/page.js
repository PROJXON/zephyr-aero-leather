import fetchProducts from "../../lib/woocommerce";
import ProductList from "../components/ProductList";
import FloatingCartButton from "@/components/FloatingCartButton";
import Image from "next/image";

export const revalidate = 60;

export default async function Home() {
  const products = await fetchProducts();

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
              <Image
                src="/images/hero-leather.svg"
                alt="Premium leather collection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl text-neutral-dark font-normal">Our Products</h2>
          </div>
          <ProductList products={products} />
        </div>
      </section>

      <FloatingCartButton />
    </div>
  );
}