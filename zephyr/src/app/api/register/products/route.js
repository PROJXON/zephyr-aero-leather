import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
});

export async function GET() {
  try {
    const response = await api.get("products");
    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: error.response?.status || 500 }
    );
  }
}
