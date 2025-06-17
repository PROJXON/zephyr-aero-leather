"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { FaStar, FaThumbsUp, FaFlag } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";
import type { WooOrder, CartItemResponse } from "../../types/woocommerce";
import type { Review, User } from "../../types/types";
import Link from "next/link";

interface ProductReviewsProps {
  productId: string;
}

interface ReviewStats {
  total: number;
  average: number;
  distribution: {
    [key: number]: number;
  };
}

interface Order {
  line_items: {
    product_id: string;
  }[];
}

interface WooCommerceReview extends Review {
  date_created: string;
  helpful_count?: number;
  reviewer: string;
  review: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<WooCommerceReview[]>([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest" | "helpful">("newest");
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      checkPurchaseStatus();
      checkReviewStatus();
    }
  }, [productId, isAuthenticated]);

  const checkPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/order?userID=${user?.id}`);
      const data = await response.json();
      const orders = data.orders || [];
      
      const hasBought = orders.some((order: Order) => 
        order.line_items.some(item => item.product_id === productId)
      );
      
      setHasPurchased(hasBought);
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  const checkReviewStatus = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&userId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to check review status");
      const data = await response.json();
      setHasReviewed(data.length > 0);
    } catch (error) {
      console.error("Error checking review status:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      setError("Error loading reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          review: newReview,
          userId: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setReviews([...reviews, data]);
      setNewReview("");
      setRating(5);
    } catch (error) {
      if (error instanceof Error && error.message === "You have already reviewed this product") {
        setError("You have already reviewed this product. You can only leave one review per product.");
      } else if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const reviewStats: ReviewStats = {
    total: reviews.length,
    average: reviews.length > 0 
      ? Number((reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1))
      : 0,
    distribution: {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    }
  };

  const sortReviews = (reviewsToSort: WooCommerceReview[]) => {
    let filtered = filterRating > 0 
      ? reviewsToSort.filter(review => review.rating === filterRating)
      : reviewsToSort;

    switch (sortBy) {
      case "newest":
        return [...filtered].sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
      case "oldest":
        return [...filtered].sort((a, b) => new Date(a.date_created).getTime() - new Date(b.date_created).getTime());
      case "highest":
        return [...filtered].sort((a, b) => b.rating - a.rating);
      case "lowest":
        return [...filtered].sort((a, b) => a.rating - b.rating);
      case "helpful":
        return [...filtered].sort((a, b) => (b.helpful_count || 0) - (a.helpful_count || 0));
      default:
        return filtered;
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  const sortedReviews = sortReviews(reviews);

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center">
                <span className="text-2xl font-bold">{reviewStats.average}</span>
                <div className="flex ml-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(reviewStats.average) ? "text-neutral-dark" : "text-neutral-light"}
                      size={16}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-neutral-medium">({reviewStats.total} reviews)</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-medium">Filter</label>
            <select
              value={filterRating}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setFilterRating(Number(e.target.value))}
              className="text-sm border border-neutral-medium rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-light w-full"
            >
              <option value={0}>All Ratings</option>
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>
                  {rating} {rating === 1 ? 'Star' : 'Stars'} ({reviewStats.distribution[rating]})
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-medium">Sort by</label>
            <select
              value={sortBy}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm border border-neutral-medium rounded px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-light w-full"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      </div>

      {/* List of reviews */}
      <div className="space-y-4 mb-8">
        {sortedReviews.length === 0 ? (
          <p className="text-neutral-medium">No reviews match your filter criteria.</p>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
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
                </div>
                <span className="text-sm text-neutral-medium sm:ml-4">
                  {new Date(review.date_created).toLocaleDateString()}
                </span>
              </div>
              <div 
                className="mt-2 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: review.review }}
              />
              <div className="mt-2 flex items-center gap-4">
                <button 
                  className="text-sm text-neutral-medium hover:text-neutral-dark flex items-center gap-1"
                  onClick={() => {/* TODO: Implement helpful functionality */}}
                >
                  <FaThumbsUp className="w-4 h-4" />
                  Helpful
                </button>
                <button 
                  className="text-sm text-neutral-medium hover:text-neutral-dark flex items-center gap-1"
                  onClick={() => {/* TODO: Implement report functionality */}}
                >
                  <FaFlag className="w-4 h-4" />
                  Report
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isAuthenticated ? (
        hasPurchased ? (
          hasReviewed ? (
            <p className="text-gray-600">You have already reviewed this product.</p>
          ) : (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Write a Review</h3>
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none"
                      >
                        <FaStar
                          className={star <= rating ? "text-neutral-dark" : "text-neutral-light"}
                          size={24}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="review" className="block text-sm font-medium mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    className="w-full p-3 border border-neutral-medium rounded focus:outline-none focus:ring-2 focus:ring-neutral-light"
                    rows={4}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-dark text-white rounded hover:bg-neutral-medium transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>
          )
        ) : (
          <p className="text-gray-600">You must purchase this product before leaving a review.</p>
        )
      ) : (
        <p className="text-gray-600">
          Please <Link href="/login" className="text-blue-500 hover:underline">login</Link> to leave a review.
        </p>
      )}
    </div>
  );
} 