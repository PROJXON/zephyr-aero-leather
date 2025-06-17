import { NextResponse } from "next/server";
import fetchProducts from "../../../../lib/woocommerce";

export async function GET(): Promise<Response> {
  const products = await fetchProducts();
  return NextResponse.json(products);
}