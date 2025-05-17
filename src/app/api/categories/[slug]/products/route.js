import { NextResponse } from "next/server";
import fetchWooCommerce from "../../../../../../lib/fetchWooCommerce";

export async function GET(request, { params }) {
  try {
    const products = await fetchWooCommerce(
      `wc/v3/products?category=${params.slug}`,
      "Failed to fetch category products"
    );
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching category products:", error);
    return NextResponse.json({ error: "Failed to fetch category products" }, { status: 500 });
  }
} 