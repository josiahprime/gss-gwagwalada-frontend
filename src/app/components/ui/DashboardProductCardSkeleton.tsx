"use client";
import React from "react";

const DashboardProductCardSkeleton: React.FC = () => {
  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden border shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-56 w-full bg-gray-300 dark:bg-gray-700">
        {/* Floating buttons shimmer */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-gray-400 dark:bg-gray-600" />
          <div className="w-10 h-10 rounded-xl bg-gray-400 dark:bg-gray-600" />
        </div>
        {/* Stock badge shimmer */}
        <div className="absolute bottom-3 left-3">
          <div className="w-20 h-5 rounded-full bg-gray-400 dark:bg-gray-600" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start gap-2 mb-2">
          {/* Title */}
          <div className="h-6 w-3/4 bg-gray-400 dark:bg-gray-600 rounded-md mb-2" />
        </div>

        {/* Description */}
        <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded-md mb-2" />
        <div className="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded-md mb-4" />

        {/* Footer (Price) */}
        <div className="mt-auto pt-4 border-t flex items-center justify-between border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <div className="h-3 w-10 bg-gray-400 dark:bg-gray-600 rounded-md mb-1" />
            <div className="h-5 w-16 bg-gray-400 dark:bg-gray-600 rounded-md" />
          </div>
          <div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-lg" />
        </div>
      </div>

      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]" />
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardProductCardSkeleton;
