"use client";

import React from "react";
import { motion } from "framer-motion";
import { SearchX, RefreshCcw } from "lucide-react";

type EmptyType = "search" | "category" | "price";

interface SearchEmptyStateProps {
  onClear: () => void;
  theme?: "light" | "dark"; // ← optional now
  title?: string;
  description?: string;
  emptyType?: EmptyType;
}

const SearchEmptyState = ({
  onClear,
  theme = "light", // ← default to light
  title = "No products found",
  description = "We couldn’t find any products matching your search. Try adjusting your keywords or filters.",
  emptyType = "search",
}: SearchEmptyStateProps) => {
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`col-span-full flex flex-col items-center justify-center py-24 px-6 rounded-3xl border-2 border-dashed transition-colors duration-300
        ${
          isDark
            ? "bg-gray-900/40 border-gray-700"
            : "bg-gray-50 border-gray-200"
        }`}
    >
      <motion.div
        animate={emptyType === "price" ? { rotate: [0, 10, -10, 10, 0] } : { x: [-2, 2, -2, 2, 0] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
        className={`p-4 rounded-full mb-6 transition-colors
          ${isDark ? "bg-gray-800" : "bg-white shadow-sm"}`}
      >
        {emptyType === "price" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={isDark ? "text-yellow-400 w-12 h-12" : "text-yellow-500 w-12 h-12"}
          >
            <circle cx="12" cy="12" r="10" />
            <text x="12" y="16" textAnchor="middle" fontSize="10" fill="white">₦</text>
          </svg>
        ) : (
          <SearchX
            size={48}
            strokeWidth={1.5}
            className={isDark ? "text-green-400" : "text-green-500"}
            aria-hidden="true"
          />
        )}
      </motion.div>


      <h3
        className={`text-2xl font-semibold mb-2 transition-colors
          ${isDark ? "text-white" : "text-gray-900"}`}
      >
        {title}
      </h3>

      <p
        className={`text-center max-w-md mb-8 text-sm transition-colors
          ${isDark ? "text-gray-400" : "text-gray-500"}`}
      >
        {description}
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClear}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white
          bg-green-600 hover:bg-green-700
          shadow-lg shadow-green-500/20 transition-all"
      >
        <RefreshCcw size={18} />
        Clear Search
      </motion.button>
    </motion.div>
  );
};

export default SearchEmptyState;
