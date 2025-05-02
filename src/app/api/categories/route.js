import { NextResponse } from "next/server";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";

export async function GET() {
  try {
    const categories = await fetchWooCommerce("wc/v3/products/categories", "Failed to fetch categories");
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
} 