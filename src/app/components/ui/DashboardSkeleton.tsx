import React from "react";

const WidgetSkeleton = () => (
  <div className="flex justify-between flex-1 p-4 h-[100px] rounded-lg shadow-md bg-gray-200 animate-pulse">
    <div className="flex flex-col justify-between">
      <span className="h-4 w-24 bg-gray-300 rounded"></span>
      <span className="h-6 w-12 bg-gray-300 rounded"></span>
      <span className="h-3 w-20 bg-gray-300 rounded"></span>
    </div>
    <div className="flex flex-col justify-between items-end">
      <div className="h-4 w-10 bg-gray-300 rounded"></div>
      <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
    </div>
  </div>
);

const DashboardSkeleton = () => (
  <div className="flex">
    {/* Sidebar */}
    {/* <div className="w-60 bg-gray-100 animate-pulse h-screen"></div>  */}
    <div className="flex-1 p-5 space-y-5">
      <div className="flex gap-5">
        <WidgetSkeleton />
        <WidgetSkeleton />
        <WidgetSkeleton />
        <WidgetSkeleton />
      </div>
      <div className="flex gap-5">
        <div className="flex-1 h-48 bg-gray-200 rounded-lg animate-pulse"></div> {/* Featured */}
        <div className="flex-1 h-48 bg-gray-200 rounded-lg animate-pulse"></div> {/* Chart */}
      </div>
      <div className="bg-gray-200 h-80 rounded-lg animate-pulse"></div> {/* Table */}
    </div>
  </div>
);

export default DashboardSkeleton;
