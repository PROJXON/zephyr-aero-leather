"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCartButton from "@/components/FloatingCartButton";
import { useCart } from "@/hooks/useCart";

export default function BestSellers() {
  const { addToCart } = useCart();
  const [sortOption, setSortOption] = useState("featured");

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
    // Implement sorting logic here
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // Product data
  const products = [
    {
      id: 1,
      name: "Aviator Leather Jacket",
      price: "$399.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 2,
      name: "Vintage Messenger Bag",
      price: "$249.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 3,
      name: "Classic Bifold Wallet",
      price: "$89.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 4,
      name: "Leather Duffle Bag",
      price: "$329.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 5,
      name: "Premium Driving Gloves",
      price: "$129.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 6,
      name: "Handcrafted Leather Belt",
      price: "$79.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 7,
      name: "Leather Backpack",
      price: "$279.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 8,
      name: "Slim Card Case",
      price: "$59.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 9,
      name: "Weekender Travel Bag",
      price: "$349.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 10,
      name: "Bomber Leather Jacket",
      price: "$379.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 11,
      name: "Leather Passport Holder",
      price: "$69.99",
      image: "/images/placeholder.svg",
    },
    {
      id: 12,
      name: "Leather Tote Bag",
      price: "$229.99",
      image: "/images/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-2xl text-neutral-dark font-normal mb-10">Best Sellers</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with sorting options */}
          <div className="w-full md:w-48 shrink-0">
            <div className="border border-neutral-light p-3 rounded-md bg-white shadow-sm">
              <h2 className="text-sm font-medium mb-2 text-neutral-dark">Sort</h2>
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="featured"
                    checked={sortOption === "featured"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Featured</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="best-selling"
                    checked={sortOption === "best-selling"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Best selling</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="alphabetically-az"
                    checked={sortOption === "alphabetically-az"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Alphabetically, A-Z</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="alphabetically-za"
                    checked={sortOption === "alphabetically-za"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Alphabetically, Z-A</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="price-low-high"
                    checked={sortOption === "price-low-high"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Price, low to high</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="price-high-low"
                    checked={sortOption === "price-high-low"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Price, high to low</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="date-old-new"
                    checked={sortOption === "date-old-new"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Date, old to new</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="sort"
                    value="date-new-old"
                    checked={sortOption === "date-new-old"}
                    onChange={handleSortChange}
                    className="rounded-full w-3 h-3 accent-primary"
                  />
                  <span className="text-xs text-neutral-medium">Date, new to old</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group border border-neutral-light p-4 hover:shadow-md transition-shadow bg-white"
                >
                  <Link href={`/products/${product.id}`} className="block">
                    <div className="relative aspect-square mb-4 bg-white flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-contain max-h-full"
                      />
                    </div>
                    <h3 className="text-sm text-neutral-dark mb-1">{product.name}</h3>
                    <p className="text-sm text-neutral-medium">{product.price}</p>
                  </Link>
                  <Button
                    className="w-full mt-4 bg-primary hover:bg-accent text-white rounded-none"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-1">
                <button className="w-10 h-10 flex items-center justify-center border border-neutral-light rounded-md text-neutral-medium hover:bg-secondary">
                  &lt;
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-primary bg-primary text-white rounded-md">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-neutral-light rounded-md text-neutral-medium hover:bg-secondary">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-neutral-light rounded-md text-neutral-medium hover:bg-secondary">
                  3
                </button>
                <button className="w-10 h-10 flex items-center justify-center border border-neutral-light rounded-md text-neutral-medium hover:bg-secondary">
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}