"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useProductStore } from "store/product/useProductStore";
import { useThemeStore } from "store/theme/themeStore";
import { motion, AnimatePresence } from "framer-motion";

const DashboardProductSearch = () => {
  const theme = useThemeStore((s) => s.theme);
  const { query, setSearchQuery } = useProductStore();
  const [localQuery, setLocalQuery] = useState(query.search || "");
  const [isFocused, setIsFocused] = useState(false);

  // Sync local state if cleared externally
  useEffect(() => {
    setLocalQuery(query.search || "");
  }, [query.search]);

  // Debounce → store
  useEffect(() => {
    if (localQuery === query.search) return;
    const t = setTimeout(() => setSearchQuery(localQuery), 400);
    return () => clearTimeout(t);
  }, [localQuery, query.search, setSearchQuery]);

  const showFloatingLabel = isFocused || localQuery.length > 0;

  return (
    <div
      className={`relative flex items-center w-full md:w-[380px] px-3 py-2 rounded-xl shadow-sm transition
        ${theme === "dark"
          ? "bg-gray-700 text-gray-200 border border-gray-600"
          : "bg-white text-gray-700 border border-gray-200"}`}
    >
      {/* Search icon */}
      <FaSearch className="text-gray-400 shrink-0 mr-2" />

      {/* Floating placeholder */}
      <AnimatePresence>
        {!showFloatingLabel && (
          <motion.label
            initial={{ opacity: 1, x: 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none select-none"
          >
            Search products...
          </motion.label>
        )}
      </AnimatePresence>

      {/* Input */}
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:ring-offset-0 text-sm pl-1"
      />
    </div>
  );
};

export default DashboardProductSearch;
