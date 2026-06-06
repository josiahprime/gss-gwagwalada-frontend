"use client";

import React, { useEffect, useState } from "react";
import { Heart, Loader2, Trash2 } from "lucide-react";
import { useProductStore } from "store/product/useProductStore";
import { useAuthStore } from "store/auth/useAuthStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { formatCurrency } from "utils/FormatCurrency";

export default function WishlistPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  const fetchFavorites = useProductStore((state) => state.fetchFavorites);
  const toggleFavorite = useProductStore((state) => state.toggleFavorite);
  const favorites = useProductStore((state) => state.favoriteProducts);
  const loading = useProductStore((state) => state.isLoading);
  const userId = useAuthStore((state) => state.authUser?.id);

  useEffect(() => {
    if (!userId) return;
    fetchFavorites(userId);
  }, [userId, fetchFavorites]);

  const handleRemove = async (productId: string, productName: string) => {
    if (!userId) return;
    try {
      await toggleFavorite(userId, productId);
      toast.success(`${productName} removed from wishlist`);
    } catch {
      toast.error("Failed to remove item from wishlist");
    }
  };

  const handleToggleFavorite = async (productId: string, productName: string) => {
    if (!userId) {
      toast.error("Please log in to manage favorites");
      return;
    }
    try {
      await toggleFavorite(userId, productId);
      const isFav = favorites.some((f) => f.id === productId);
      toast.success(
        isFav ? `${productName} removed from wishlist` : `${productName} added to wishlist`
      );
    } catch {
      toast.error("Something went wrong. Try again.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(favorites.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedItems = favorites.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 bg-white shadow-sm">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl mb-6 bg-gradient-to-r from-green-600 to-emerald-700 p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-md">
        {/* Left Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-white/20 p-3 rounded-full shadow-sm backdrop-blur-sm flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              Your Wishlist
            </h1>
            <p className="text-sm text-green-100 mt-1 sm:mt-0.5">
              Keep track of what you love and revisit later.
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-fit text-sm sm:text-base font-medium text-white sm:text-green-100 bg-white/10 sm:bg-transparent px-3 py-1.5 sm:px-0 rounded-full sm:rounded-none self-start sm:self-auto">
          {favorites.length} {favorites.length === 1 ? "item" : "items"}
        </div>

      </div>


      {/* STATES */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-500 mb-4" />
          <p className="text-gray-600">Loading your favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <Heart className="w-12 h-12 text-gray-300 mb-4" />
          <h2 className="text-lg font-semibold mb-1">Your wishlist is empty</h2>
          <p className="text-sm max-w-[400px]">
            Add items you love to your wishlist and find them easily later.
          </p>
        </div>
      ) : (
        <>
          {/* PRODUCT GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {paginatedItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div
                  className="relative cursor-pointer"
                  onClick={() => router.push(`/products/${item.id}`)}
                >
                  <Image
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.productName}
                    width={300}
                    height={200}
                    className="w-full h-40 sm:h-48 object-cover"
                  />

                  {/* Action Icons (Left: Heart, Right: Trash) */}
                  <div className="absolute top-2 left-2 right-2 flex justify-between items-center px-2">
                    {/* Favorite */}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(item.id, item.productName);
                      }}
                      className="bg-white p-1 rounded-full shadow hover:bg-pink-50 transition"
                      title="Add to Favorites"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.some((f) => f.id === item.id)
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.button>

                    {/* Delete */}
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id, item.productName);
                      }}
                      className="bg-white p-1 rounded-full shadow hover:bg-red-50 transition"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="text-base font-semibold truncate text-gray-800">
                    {item.productName}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {item.description}
                  </p>

                  <div className="mt-3 flex justify-between items-center">
                    <div className="text-sm font-bold text-green-700">
                      {formatCurrency(item.priceInKobo)}
                    </div>
                    <button
                      onClick={() => router.push(`/products/${item.id}`)}
                      className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition"
                    >
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center mt-8 gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>

              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
