import { NextResponse } from "next/server";
import fetchWooCommerce from "../../../../../lib/fetchWooCommerce";

export async function GET(request, { params }) {
  try {
    const categories = await fetchWooCommerce("wc/v3/products/categories", "Failed to fetch categories");
    const category = categories.find(cat => cat.slug === params.slug);
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 });
  }
} 