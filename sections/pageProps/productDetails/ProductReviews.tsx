"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import WriteReviewForm from "./WriteReviewForm";
import { Star, SlidersHorizontal, ChevronDown, Check } from "lucide-react";
import { useReviewStore } from "store/review/useReviewStore";
import { useAuthStore } from "store/auth/useAuthStore";
import toast from "react-hot-toast";

// Dummy reviews matching DB schema
interface ExtendedReview {
  id: string;
  rating: number;
  text: string;
  createdAt: string;
  user: { username: string; profile?: string };
  verified?: boolean;
}

const dummyReviews: ExtendedReview[] = [
  {
    id: "dummy-1",
    rating: 4,
    text:
      "I love shopping here for my weekly groceries! The farm-fresh produce is vibrant and flavorful. This site has become my go-to for quality ingredients.",
    createdAt: "2024-08-05T00:00:00Z",
    user: { username: "David Turner", profile: "/assets/profilepic01.jpg" },
    verified: true,
  },
  {
    id: "dummy-2",
    rating: 4.5,
    text:
      "The freshness of the ingredients has transformed my dishes. I highly recommend their products to any chef seeking excellence.",
    createdAt: "2024-07-21T00:00:00Z",
    user: { username: "Maria Gonzalez", profile: "/assets/profilepic02.jpg" },
    verified: true,
  },
  {
    id: "dummy-3",
    rating: 5,
    text:
      "Thanks to RichField’s reliable products, I can confidently recommend healthy options to my clients.",
    createdAt: "2024-06-10T00:00:00Z",
    user: { username: "Sophia Carter", profile: "https://readymadeui.com/team-3.webp" },
    verified: true,
  },
];

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { reviews, fetchReviews, loading, error } = useReviewStore();
  const authUser = useAuthStore((state) => state.authUser);

  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    fetchReviews(productId).catch((err) => toast.error(err.message || "Failed to load reviews"));
  }, [productId, fetchReviews]);

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "fill-[#FFC633] text-[#FFC633]"
              : i < rating
              ? "fill-[#FFC633] text-[#FFC633] opacity-50"
              : "fill-none text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  // Show fetched reviews, or dummy reviews if empty
  const reviewsToShow: ExtendedReview[] = reviews.length
    ? reviews.map((r) => ({
        ...r,
        verified: true, // optionally mark all real reviews as verified
        user: {
          username: r.user.name,
          profile: (r.user as any).profile, // optional profile if available
        },
      }))
    : dummyReviews;

  return (
    <div className="py-10 max-w-6xl mx-auto px-4 font-[sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">
          Customer Reviews{" "}
          <span className="text-black/60 text-base font-normal">({reviewsToShow.length})</span>
        </h2>

        <div className="flex gap-3">
          <button className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          <button className="px-5 py-3 bg-gray-100 rounded-full flex items-center gap-2 hover:bg-gray-200">
            <span>Latest</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {authUser && (
            <button
              onClick={() => setShowForm((prev) => !prev)}
              className="rounded-full px-5 py-3 bg-black text-white hover:bg-gray-900 transition"
            >
              {showForm ? "Cancel Review" : "Write a Review"}
            </button>
          )}
        </div>
      </div>

      {/* Write Review Form */}
      {showForm && authUser && <WriteReviewForm productId={productId} />}

      {/* Loading & Error */}
      {loading && <p className="text-center text-gray-500 mb-4">Loading reviews...</p>}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviewsToShow.map((review) => (
          <div
            key={review.id}
            className="border border-gray-200 rounded-3xl p-7 bg-white hover:shadow-md transition"
          >
            {renderStars(review.rating)}

            <div className="flex items-center gap-3 mt-4 mb-3">
              {review.user.profile ? (
                <img
                  src={review.user.profile}
                  alt={review.user.username}
                  className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700 text-lg">
                  {review.user.username.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex items-center gap-2">
                <h4 className="font-bold text-lg">{review.user.username}</h4>
                {review.verified && (
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            <p className="text-black/70 leading-relaxed mb-6">{review.text}</p>
            <p className="text-black/60 text-sm">
              Posted on {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* See More Reviews */}
      <div className="flex justify-center mt-10">
        <Link
          href={`/products/${productId}/reviews`}
          className="inline-block rounded-full px-14 py-3 border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          See All Reviews
        </Link>
      </div>

    </div>
  );
}
