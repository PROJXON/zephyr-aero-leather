"use client";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

export default function ProductReviews({ productId }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      checkPurchaseStatus();
      checkReviewStatus();
    }
  }, [productId, isAuthenticated]);

  const checkPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/order?userID=${user.id}`);
      const data = await response.json();
      const orders = data.orders || [];

      const hasBought = orders.some(order =>
        Array.isArray(order.items) &&
        order.items.some(item => item.id === productId)
      );

      setHasPurchased(hasBought);
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  const checkReviewStatus = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&userId=${user.id}`);
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

  const handleSubmitReview = async (e) => {
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
          userId: user.id,
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
      if (error.message === "You have already reviewed this product") {
        setError("You have already reviewed this product. You can only leave one review per product.");
      } else {
        setError(error.message);
      }
    }
  };

  if (loading) return <div>Loading reviews...</div>;

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
            <p className="text-gray-600">You have already reviewed this product.</p>
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
                  onChange={(e) => setNewReview(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="4"
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
          <p className="text-gray-600">You must purchase this product before leaving a review.</p>
        )
      ) : (
        <p className="text-gray-600">Please <a href="/login" className="text-blue-500 hover:underline">login</a> to leave a review.</p>
      )}
    </div>
  );
}
