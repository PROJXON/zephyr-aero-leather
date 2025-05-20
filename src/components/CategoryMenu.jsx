"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function CategoryMenu() {
  const [categories, setCategories] = useState([]);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeCategory = searchParams.get("category");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    fetchCategories();
  }, []);

  const handleCategoryClick = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === null) {
      newParams.delete("category");
    } else {
      newParams.set("category", slug);
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="mb-4">
      <button
        onClick={() => handleCategoryClick(null)}
        className={`mr-2 px-4 py-2 rounded border border-transparent ${!activeCategory ?
        "text-green-600 bg-transparent"
        : "text-white bg-transparent"
        }`}
      >
        All
      </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`mr-2 px-4 py-2 rounded border border-transparent ${
              activeCategory === cat.slug
                ? "text-green-600 bg-transparent"
                : "text-white bg-transparent"
            }`}          >
            {cat.label}
          </button>
        ))}
    </div>
  );
}
