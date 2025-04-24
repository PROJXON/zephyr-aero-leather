import { NextResponse } from "next/server"
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";

// Obtener reviews de un producto
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) return NextResponse.json({ error: "Product ID is required" }, { status: 400 })

  const reviewsError = "Failed to fetch reviews"

  try {
    const reviews = await fetchWooCommerce(`wc/v3/products/reviews?product=${productId}`, reviewsError)
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: reviewsError }, { status: 500 });
  }
}

// Crear un nuevo review
export async function POST(req) {
  try {
    const { productId, rating, review, name, email } = await req.json();

    // Crear el review
    const reviewResponse = await fetch(`${process.env.WOOCOMMERCE_API_URL}/wp-json/wc/v3/products/reviews`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        review,
        reviewer: name,
        reviewer_email: email,
        rating,
      }),
    });

    if (!reviewResponse.ok) throw new Error("Failed to create review");
    const newReview = await reviewResponse.json();
    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
} 