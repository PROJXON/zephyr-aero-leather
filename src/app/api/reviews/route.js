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
  const createReviewError = "Failed to create review"

  try {
    const { productId, rating, review, name, email } = await req.json();

    // Crear el review
    const newReview = await fetchWooCommerce("wc/v3/products/reviews", createReviewError, null, "POST", {
      product_id: productId,
      review,
      reviewer: name,
      reviewer_email: email,
      rating,
    })
    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json({ error: createReviewError }, { status: 500 });
  }
} 