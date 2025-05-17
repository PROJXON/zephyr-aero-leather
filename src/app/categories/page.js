"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // Fetch products
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        setProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductsByCategory = (categoryId) => {
    return products.filter(product => 
      product.categories.some(cat => cat.id === categoryId)
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-light text-neutral-dark mb-8 text-center">Shop by Category</h1>
        
        <div className="grid gap-12">
          {categories.map((category) => {
            const categoryProducts = getProductsByCategory(category.id);
            
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-light text-neutral-dark">{category.name}</h2>
                  <Link 
                    href={`/category/${category.slug}`}
                    className="text-primary hover:text-accent text-sm font-medium flex items-center gap-1"
                  >
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {categoryProducts.slice(0, 5).map((product) => (
                    <div key={product.id} className="group flex flex-col h-full">
                      <Link href={`/product/${product.id}`} className="flex-1">
                        <div className="relative aspect-square overflow-hidden rounded-lg bg-white mb-3 shadow-sm group-hover:shadow-md transition-shadow">
                          <Image
                            src={product.images[0]?.src || "/images/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-sm font-medium text-neutral-dark mb-1 line-clamp-2">{product.name}</h3>
                        <p className="text-primary text-sm font-medium">${product.price}</p>
                      </Link>
                      <Button
                        className="w-full mt-3 bg-primary hover:bg-accent text-white rounded-none text-sm py-1.5"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 