"use client";

import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore } from "store/product/useProductStore";








const SearchBar = () => {
  // 1. Get the store's state and the setter we just created
  const { searchQuery: storeSearchQuery, setSearchQuery } = useProductStore();

  // 2. Local state for immediate input feedback
  const [localQuery, setLocalQuery] = useState(storeSearchQuery || "");
  const [isFocused, setIsFocused] = useState(false);





  // 3. Sync local state if the store is cleared from the outside (e.g., Header or Empty State)
  useEffect(() => {
    setLocalQuery(storeSearchQuery || "");
  }, [storeSearchQuery]);

  // 4. Debounce: Only update the Store after the user stops typing for 300ms
  useEffect(() => {
    if (localQuery === storeSearchQuery) return;

    const handler = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [localQuery, storeSearchQuery, setSearchQuery]);




  return (
    <div className="relative h-[50px] text-base text-primeColor bg-transparent shadow-md flex items-center justify-between px-2 rounded-xl mb-2 lg:mb-0">
      <div className="relative w-[400px] h-full flex items-center">
        <input
          className="flex-1 h-full border-none outline-none text-sm placeholder-transparent focus:ring-0"
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <AnimatePresence>
          {!localQuery && !isFocused && (
            <motion.span
              initial={{ opacity: 1, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] text-[14px] pointer-events-none select-none"
            >
              Search your products here
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <FaSearch className="w-5 h-5 ml-2 text-gray-400" />
    </div>
  );
};

export default SearchBar;
