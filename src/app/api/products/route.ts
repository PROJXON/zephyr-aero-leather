import { NextResponse } from "next/server";
import fetchProducts from "../../../../lib/woocommerce";
import type { NextRequest } from "next/server";

export async function GET(_req?: NextRequest): Promise<Response> {
  const products = await fetchProducts();
  return NextResponse.json(products);
}