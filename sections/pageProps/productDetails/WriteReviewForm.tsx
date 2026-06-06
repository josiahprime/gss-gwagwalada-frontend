"use client";

import { useState, useEffect } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { useReviewStore } from "store/review/useReviewStore";
import { useAuthStore } from "store/auth/useAuthStore";

interface WriteReviewFormProps {
  productId: string;
}

export default function WriteReviewForm({ productId }: WriteReviewFormProps) {
  const { addReview, loading } = useReviewStore();
  const reviews = useReviewStore((state)=>state.reviews)
  const fetchReviews = useReviewStore((state)=>state.fetchReviews)
  const userId = useAuthStore((state) => state.authUser?.id);

  const [formRating, setFormRating] = useState(0);
  const [formText, setFormText] = useState("");

  useEffect(() => {
    if (!productId) return;
    fetchReviews(productId);
  }, [productId]);



  useEffect(() => {
    if (!userId) return;

    const existingReview = reviews.find(r => r.user.id === userId);
    if (existingReview) {
      console.log('review found')
      setFormRating(existingReview.rating);
      setFormText(existingReview.text);
    }else{console.log('no reviews found')}
  }, [userId, reviews]);

  const handleSubmit = async () => {
    if (formRating <= 0) {
      toast.error("Please select a rating");
      return;
    }


    if (!userId) {
      toast.error("You must be logged in to submit a review");
      return;
    }

    const reviewData = {
      userId,
      rating: formRating,
      text: formText.trim(),
      productId,
    };

    const promise = addReview(reviewData);

    toast.promise(promise, {
      loading: "Submitting your review...",
      success: "Review submitted successfully! 🎉",
      error: "Failed to submit review",
    });

    await promise;

    setFormText("");
    setFormRating(0);

    // Refresh reviews so the UI updates
    fetchReviews(productId);
  };

  return (
    <div className="border border-gray-200 rounded-3xl p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Write a review</h3>

      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <label className="block text-sm text-black/60 mb-2">Your rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFormRating(n)}
              >
                {formRating >= n ? (
                  <FaStar className="w-6 h-6 text-yellow-400" />
                ) : (
                  <FaRegStar className="w-6 h-6 text-gray-300" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-black/60 mb-2">Your review</label>
        <textarea
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          className="w-full rounded-md border border-gray-200 px-4 py-3 min-h-[120px]"
          placeholder="Share your thoughts about the product"
        />
      </div>

      <div className="flex items-center justify-end mt-4">
        <button
          disabled={loading || formRating === 0}
          onClick={handleSubmit}
          className={`px-6 py-2 rounded-full text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-900"
          }`}
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
}
