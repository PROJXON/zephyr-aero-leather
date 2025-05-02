"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/hooks/useCart";

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sort: "featured",
    priceRange: [0, 1000],
    inStock: false,
    onSale: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const categoryRes = await fetch(`/api/categories/${slug}`);
        const categoryData = await categoryRes.json();
        setCategory(categoryData);

        // Fetch all products
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        
        // Filter products by category
        const categoryProducts = productsData.filter(product => 
          product.categories.some(cat => cat.slug === slug)
        );
        
        setProducts(categoryProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply price range filter
    result = result.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Apply in stock filter
    if (filters.inStock) {
      result = result.filter((product) => product.stock_status === "instock");
    }

    // Apply on sale filter
    if (filters.onSale) {
      result = result.filter((product) => product.sale_price);
    }

    // Apply sorting
    switch (filters.sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.date_created) - new Date(a.date_created));
        break;
      case "popular":
        result.sort((a, b) => b.total_sales - a.total_sales);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Featured (default) - keep original order
        break;
    }

    return result;
  }, [products, filters]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

  const handleSortChange = (value) => {
    setFilters({ ...filters, sort: value });
    setCurrentPage(1); // Reset to first page when changing sort
  };

  const handlePriceRangeChange = (value) => {
    setFilters({ ...filters, priceRange: value });
    setCurrentPage(1); // Reset to first page when changing price range
  };

  const handleFilterChange = (filter) => {
    setFilters({ ...filters, [filter]: !filters[filter] });
    setCurrentPage(1); // Reset to first page when changing filters
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

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-light text-neutral-dark mb-4">Category not found</h1>
            <Link href="/categories" className="text-primary hover:text-accent">
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 space-y-8 bg-white p-6 rounded-lg shadow-sm">
              {/* Sort */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-dark">Sort By</h3>
                <Select value={filters.sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sort option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-dark">Price Range</h3>
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  min={0}
                  max={1000}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-neutral-medium">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>

              {/* Filters */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-dark">Filters</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="inStock"
                      checked={filters.inStock}
                      onCheckedChange={() => handleFilterChange("inStock")}
                    />
                    <Label htmlFor="inStock" className="text-sm">In Stock Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="onSale"
                      checked={filters.onSale}
                      onCheckedChange={() => handleFilterChange("onSale")}
                    />
                    <Label htmlFor="onSale" className="text-sm">On Sale</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-neutral-dark mb-2">{category.name}</h1>
              <p className="text-neutral-500">{filteredProducts.length} products</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedProducts.map((product) => (
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
                    <div className="flex items-center gap-2">
                      <p className="text-primary text-sm font-medium">${product.price}</p>
                      {product.sale_price && (
                        <p className="text-neutral-500 line-through text-sm">${product.regular_price}</p>
                      )}
                    </div>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 p-0"
                  >
                    &lt;
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-10 h-10 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 p-0"
                  >
                    &gt;
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 