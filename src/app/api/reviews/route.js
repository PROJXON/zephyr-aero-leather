import { NextResponse } from "next/server"
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const userId = searchParams.get("userId");

  const reviewsError = "Failed to fetch reviews";

  try {
    let endpoint = "wc/v3/products/reviews";

    if (productId && userId) {
      endpoint += `?product=${productId}&customer=${userId}`;
    } else if (productId) {
      endpoint += `?product=${productId}`;
    } else if (userId) {
      endpoint += `?customer=${userId}`;
    }

    const reviews = await fetchWooCommerce(endpoint, reviewsError);
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: reviewsError }, { status: 500 });
  }
}


// Crear un nuevo review
export async function POST(req) {
  const createReviewError = "Failed to create review"

  try {
    const { productId, rating, review, userId } = await req.json();

    // Verificar que el usuario haya comprado el producto
    const orders = await fetchWooCommerce(`wc/v3/orders?customer=${userId}`, "Failed to fetch orders");
    
    const hasPurchased = orders.some(order => 
      order.line_items.some(item => item.product_id === productId)
    );

    if (!hasPurchased) {
      return NextResponse.json({ error: "You must purchase this product before leaving a review" }, { status: 403 });
    }

    // Verificar si el usuario ya ha dejado una reseña para este producto
    const existingReviews = await fetchWooCommerce(`wc/v3/products/reviews?product=${productId}&customer=${userId}`, "Failed to fetch existing reviews");
    
    if (existingReviews.length > 0) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 403 });
    }

    // Obtener información del usuario
    const user = await fetchWooCommerce(`wc/v3/customers/${userId}`, "Failed to fetch user information");

    // Crear el review
    const newReview = await fetchWooCommerce("wc/v3/products/reviews", createReviewError, null, "POST", {
      product_id: productId,
      review,
      rating,
      reviewer: user.first_name, // Using first_name from customer data
      reviewer_email: user.email, // Using actual user email
    })
    
    return NextResponse.json(newReview);
  } catch (error) {
    return NextResponse.json({ error: createReviewError }, { status: 500 });
  }
} 