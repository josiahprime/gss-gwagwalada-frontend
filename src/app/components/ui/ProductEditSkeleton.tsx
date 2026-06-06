// components/ProductEditSkeleton.tsx
"use client";

import React from "react";

const ProductEditSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-[1200px] p-6 animate-pulse space-y-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* LEFT FORM Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <div className="h-12 bg-gray-200 rounded w-full" />
          <div className="h-32 bg-gray-200 rounded w-full" />
          <div className="h-12 bg-gray-200 rounded w-full" />
          <div className="h-12 bg-gray-200 rounded w-full" />
          <div className="h-12 bg-gray-200 rounded w-full" />
        </div>

        {/* RIGHT Sidebar Skeleton */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="h-60 w-full rounded-lg bg-gray-200" />
          <div className="h-40 w-full rounded-lg bg-gray-200" />
        </aside>
      </div>
    </div>
  );
};

export default ProductEditSkeleton;
