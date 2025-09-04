import { NextResponse } from "next/server";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";
import getCookieInfo from "../../../../lib/getCookieInfo";
import type { NextRequest } from "next/server";
import type { WooOrder, WooCustomer, WooCommerceReview, PublicReview } from "../../../../types/woocommerce";

function stripReviewerEmail(review: WooCommerceReview): PublicReview {
  // Remove sensitive reviewer_email field without creating an unused binding
  const rest = { ...review } as Record<string, unknown>;
  delete (rest as { reviewer_email?: unknown }).reviewer_email;
  return rest as unknown as PublicReview;
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const userId = searchParams.get("userId");

  const reviewsError = "Failed to fetch reviews";

  if (!productId && !userId) {
    return NextResponse.json({ error: "Must provide productId or userId" }, { status: 400 });
  }

  try {
    let endpoint = "wc/v3/products/reviews";

    const query = new URLSearchParams();
    if (productId) query.set("product", productId);
    if (userId) query.set("customer", userId);
    
    // If only userId is provided (no productId), we need to fetch all pages
    // to get all reviews by this user
    if (userId && !productId) {
      const allReviews: WooCommerceReview[] = [];
      let page = 1;
      const perPage = 100; // Maximum per page
      
      while (true) {
        query.set("page", page.toString());
        query.set("per_page", perPage.toString());
        
        const pageEndpoint = `${endpoint}?${query.toString()}`;
        const pageReviews = await fetchWooCommerce(pageEndpoint, reviewsError) as WooCommerceReview[];
        
        if (pageReviews.length === 0) {
          break; // No more reviews
        }
        
        allReviews.push(...pageReviews);
        
        if (pageReviews.length < perPage) {
          break; // This was the last page
        }
        
        page++;
      }
      // Remove sensitive fields before returning
      const sanitized: PublicReview[] = allReviews.map(stripReviewerEmail);
      return NextResponse.json(sanitized);
    } else {
      // For specific product reviews, just get the first page
      endpoint += `?${query.toString()}`;
      const reviews = await fetchWooCommerce(endpoint, reviewsError) as WooCommerceReview[];
      const sanitized: PublicReview[] = reviews.map(stripReviewerEmail);
      return NextResponse.json(sanitized);
    }
  } catch {
    return NextResponse.json({ error: reviewsError }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  const createReviewError = "Failed to create review";

  try {
    const { productId, rating, review, userId }: { productId: number; rating: number; review: string; userId: number } = await req.json();

    // Use the same approach as /api/order endpoint
    const [token] = await getCookieInfo();
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await fetchWooCommerce("customcarteditor/v1/get-orders", "Failed to fetch orders", token) as WooOrder[];
    
    const hasPurchased = orders.some((order: WooOrder) =>
      Array.isArray(order.items) &&
      order.items.some((item) => item.id === productId)
    );

    if (!hasPurchased) {
      return NextResponse.json({ error: "You must purchase this product before leaving a review" }, { status: 403 });
    }

    // Check if user has already reviewed this product
    const existingReviews = await fetchWooCommerce(`wc/v3/products/reviews?product=${productId}&customer=${userId}`, "Failed to fetch existing reviews") as WooCommerceReview[];

    if (existingReviews.length > 0) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 403 });
    }

    // Get user info for the review
    const user = await fetchWooCommerce<WooCustomer>(`wc/v3/customers/${userId}`, "Failed to fetch user information");

    const newReview = await fetchWooCommerce("wc/v3/products/reviews", createReviewError, null, "POST", {
      product_id: productId,
      review,
      rating,
      reviewer: user.first_name || user.email.split('@')[0],
      reviewer_email: user.email,
    });

    return NextResponse.json(newReview);
  } catch {
    return NextResponse.json({ error: createReviewError }, { status: 500 });
  }
}
