"use client";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/app/context/AuthContext";

export default function ProductReviews({ productId }) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    fetchReviews();
    if (isAuthenticated) {
      checkPurchaseStatus();
    }
  }, [productId, isAuthenticated]);

  const checkPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/order?userID=${user.id}`);
      const data = await response.json();
      const orders = data.orders || [];
      
      // Check if any order contains this product
      const hasBought = orders.some(order => 
        order.line_items.some(item => item.product_id === productId)
      );
      
      setHasPurchased(hasBought);
    } catch (error) {
      console.error("Error checking purchase status:", error);
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
      setError(error.message);
    }
  };

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      
      {/* Lista de reviews */}
      <div className="space-y-4 mb-8">
        {reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
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
                      className={star <= rating ? "text-yellow-400" : "text-gray-300"}
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-gray-600">You must purchase this product before leaving a review.</p>
        )
      ) : (
        <p className="text-gray-600">Please <a href="/login" className="text-blue-500 hover:underline">login</a> to leave a review.</p>
      )}
    </div>
  );
} 