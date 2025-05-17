"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";

export default function Home() {
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
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-primary hover:bg-accent text-white rounded-none">Shop Now</Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-neutral-light text-neutral-dark hover:bg-secondary rounded-none"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/images/hero-leather.svg" alt="Premium leather collection" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl text-neutral-dark font-normal">Best Sellers</h2>
            <Link
              href="/best-sellers"
              className="text-neutral-medium hover:text-primary flex items-center gap-2 text-sm"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Aviator Leather Jacket", price: "$399.99", image: "/images/placeholder.svg" },
              { name: "Vintage Messenger Bag", price: "$249.99", image: "/images/placeholder.svg" },
              { name: "Classic Bifold Wallet", price: "$89.99", image: "/images/placeholder.svg" },
              { name: "Premium Driving Gloves", price: "$129.99", image: "/images/placeholder.svg" },
            ].map((product, index) => (
              <div key={index} className="group">
                <div className="relative aspect-square bg-card mb-3 overflow-hidden shadow-sm">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-neutral-dark font-medium">{product.name}</h3>
                <p className="text-neutral-medium">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Collection */}
      <section className="py-16 bg-warm-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl text-neutral-dark font-normal mb-10">Shop By Collection</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jackets */}
            <div className="flex flex-col">
              <div className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                <Image
                  src="/images/placeholder.svg"
                  alt="Leather Jackets Collection"
                  width={500}
                  height={500}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <h3 className="text-neutral-dark text-center">Jackets</h3>
              <p className="text-neutral-medium text-center text-sm">18 products</p>
            </div>

            {/* Bags */}
            <div className="flex flex-col">
              <div className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                <Image
                  src="/images/placeholder.svg"
                  alt="Leather Bags Collection"
                  width={500}
                  height={500}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <h3 className="text-neutral-dark text-center">Bags</h3>
              <p className="text-neutral-medium text-center text-sm">24 products</p>
            </div>

            {/* Accessories */}
            <div className="flex flex-col">
              <div className="bg-white rounded-lg overflow-hidden mb-4 shadow-sm">
                <Image
                  src="/images/placeholder.svg"
                  alt="Leather Accessories Collection"
                  width={500}
                  height={500}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <h3 className="text-neutral-dark text-center">Accessories</h3>
              <p className="text-neutral-medium text-center text-sm">16 products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl text-neutral-dark font-normal mb-12">Why Choose Zephyr Aero Leather</h2>

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

      {/* Testimonials */}
      <section className="py-16 bg-warm-bg">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl text-neutral-dark font-normal mb-12">What Our Customers Say</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "James R.",
                text: "My Zephyr aviator jacket has been with me for three years of travel. The leather has developed a beautiful patina and it still looks amazing.",
                rating: 5,
              },
              {
                name: "Alexandra T.",
                text: "The messenger bag is perfect for my daily commute. Fits my laptop perfectly and the leather quality is exceptional. Worth every penny.",
                rating: 5,
              },
              {
                name: "Michael K.",
                text: "I've had many wallets over the years, but none compare to the craftsmanship of my Zephyr bifold. The attention to detail is remarkable.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex mb-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-neutral-light"
                        }`}
                      />
                    ))}
                </div>
                <p className="text-neutral-medium mb-4">{testimonial.text}</p>
                <p className="text-neutral-dark font-medium">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-normal mb-4">Join Our Newsletter</h2>
            <p className="text-white/80 mb-8">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40"
              />
              <Button className="bg-white text-primary hover:bg-white/90 rounded-none px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

      <FloatingCartButton />
    </div>
  );
}
