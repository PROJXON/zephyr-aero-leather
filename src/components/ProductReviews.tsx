"use client";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import type { ProductReviewsProps } from "../../types/types";
import type { WooOrder, CartItemResponse, WooCommerceReview } from "../../types/woocommerce";

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<WooCommerceReview[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data: WooCommerceReview[] = await response.json();
        // Sort reviews by date_created in descending order (newest first)
        const sortedReviews = data.sort((a, b) => 
          new Date(b.date_created).getTime() - new Date(a.date_created).getTime()
        );
        setReviews(sortedReviews);
      } catch {
        setError("Error loading reviews");
      } finally {
        setLoading(false);
      }
    }

    async function checkPurchaseStatus() {
      try {
        const response = await fetch("/api/order");
        if (!response.ok) throw new Error("Failed to fetch orders");
        const data = await response.json();
        const orders: WooOrder[] = data.orders || [];
        
        // Check if any order contains this product - simplified approach
        const hasBought = orders.some((order: WooOrder) => {
          return Array.isArray(order.items) &&
            order.items.some((item: CartItemResponse) => {
              return item.id === productId;
            });
        });
        
        setHasPurchased(hasBought);
      } catch {
        setHasPurchased(false);
      }
    }

    async function checkReviewStatus() {
      try {
        const response = await fetch(`/api/reviews?productId=${productId}&userId=${user?.id}`);
        if (!response.ok) throw new Error("Failed to fetch user reviews");
        const data: WooCommerceReview[] = await response.json();
        // Check if user has reviewed this specific product
        setHasReviewed(data.length > 0);
      } catch {
        setHasReviewed(false);
      }
    }

    fetchReviews();
    if (isAuthenticated && user) {
      checkPurchaseStatus();
      checkReviewStatus();
    }
  }, [productId, isAuthenticated, user]);

  const handleSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!isAuthenticated) {
      setError("You must be logged in to leave a review");
      return;
    }
    if (!hasPurchased) {
      setError("You must purchase this product before leaving a review");
      return;
    }
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          review: newReview,
          userId: user?.id,
        }),
      });
      const data: WooCommerceReview | { error?: string } = await response.json();
      if (!response.ok) {
        throw new Error((data as { error?: string }).error || "Failed to submit review");
      }
      setReviews([data as WooCommerceReview, ...reviews]);
      setHasReviewed(true);
      setNewReview("");
      setRating(5);
    } catch (error) {
      if (error instanceof Error && error.message === "You have already reviewed this product") {
        setError("You have already reviewed this product");
        setHasReviewed(true);
      } else {
        setError(error instanceof Error ? error.message : "An error occurred while submitting your review");
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading reviews..." />;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-4 mb-8">
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-neutral-dark" : "text-neutral-light"}
                    />
                  ))}
                </div>
                <span className="font-bold">{review.reviewer}</span>
                <span className="text-neutral-medium text-sm">
                  {new Date(review.date_created).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div
                className="mt-2 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: review.review }}
              />
            </div>
          ))
        )}
      </div>
      {isAuthenticated ? (
        hasPurchased ? (
          hasReviewed ? (
            <p className="text-gray-600">You have already reviewed this product</p>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-2xl"
                    >
                      <FaStar
                        className={star <= rating ? "text-neutral-dark" : "text-neutral-light"}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2">Your Review</label>
                <textarea
                  value={newReview}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewReview(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                  required
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button
                type="submit"
                className="py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors"
              >
                Submit Review
              </button>
            </form>
          )
        ) : (
          <p className="text-gray-600">You must purchase this product before leaving a review</p>
        )
      ) : (
        <p className="text-gray-600">Please <a href="/login" className="hover:underline">login</a> to leave a review</p>
      )}
    </div>
  );
}