// ProductSkeleton.tsx
import React from "react";


const SearchSkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-lg shadow overflow-hidden">
    <div className="w-16 h-16 rounded relative overflow-hidden search-shimmer"></div>
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-4 rounded relative overflow-hidden search-shimmer w-3/4"></div>
      <div className="h-3 rounded relative overflow-hidden search-shimmer w-1/2"></div>
      <div className="h-4 rounded relative overflow-hidden search-shimmer w-1/4 mt-1"></div>
    </div>
  </div>
);

export default SearchSkeleton;
