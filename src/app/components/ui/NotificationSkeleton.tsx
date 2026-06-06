// app/components/ui/NotificationSkeleton.tsx

import React from 'react';

// Define the interface for the component's props
interface NotificationSkeletonProps {
  /** The number of skeleton items to render. Default is 5. */
  count?: number;
}

const NotificationSkeleton: React.FC<NotificationSkeletonProps> = ({ count = 5 }) => {
  // Create an array of length 'count' to map over and render the skeleton items
  const skeletonItems = Array.from({ length: count });

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto p-4 md:p-8 bg-white rounded-3xl shadow-2xl border border-green-100">
      
      {/* Skeleton Header Area (for completeness) */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          {/* Icon Skeleton */}
          <div className="bg-gray-200 w-12 h-12 rounded-2xl animate-pulse"></div>
          {/* Text Skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        {/* Unread Count Skeleton */}
        <div className="px-4 py-1 bg-gray-200 rounded-full w-20 h-7 animate-pulse"></div>
      </div>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {/* Quick Actions Skeleton */}
        <div className="h-8 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
        <div className="h-8 bg-gray-200 rounded-xl w-32 animate-pulse"></div>
      </div>
      
      {/* Notification List Skeleton */}
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="p-5 rounded-2xl bg-gray-50 border border-gray-100 animate-pulse transition-all duration-300"
        >
          <div className="flex items-start gap-4">
            {/* Left Icon Area */}
            <div
              className={`p-3 rounded-2xl bg-gray-200 w-10 h-10 flex-shrink-0 shadow-inner`}
            >
              {/* Icon placeholder */}
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Top Row: Title and Time */}
              <div className="flex items-start justify-between mb-2">
                {/* Title Line */}
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                {/* Timestamp Line */}
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              
              {/* Message Line 1 */}
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              {/* Message Line 2 (Shorter) */}
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              {/* "Click to read more..." Line */}
              <div className="h-3 bg-green-100 rounded w-28 mt-2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;